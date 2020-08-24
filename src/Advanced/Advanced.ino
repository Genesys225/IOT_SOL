#include <FS.h>
#include <Arduino.h>
#include <Wire.h>
#include <Sodaq_SHT2x.h>
#include <BH1750.h>
#include <string>
#include <PubSubClient.h>
/**
 * WiFiManager advanced demo, contains advanced configurartion options
 * Implements TRIGGEN_PIN button press, press for ondemand configportal, hold for 3 seconds for reset settings.
 */
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <MHZ19.h>
#include <SoftwareSerial.h>

#define TRIGGER_PIN 0
#define RX_PIN 13
#define TX_PIN 15
#define BAUDRATE 9600
#define SSID "AutoConnectAP"
#define WIFI_PASSWD "xxx12345"
#define MQTT_SERVER "192.168.1.104"
const char *mqtt_server = MQTT_SERVER;
WiFiClient wifiClient;
WiFiManager wm;                     // global wm instance
WiFiManagerParameter custom_field;  // global param ( for non blocking w params )
WiFiManagerParameter custom_field1; // global param ( for non blocking w params )
BH1750 lightMeter;
MHZ19 myMHZ19;
SoftwareSerial mySerial(RX_PIN, TX_PIN);
PubSubClient client(wifiClient);
unsigned long getDataTimer = 0;
// Topic
char *topic = "test";
int test_para = 2000;
unsigned long startMills;
char buf[100];

String clientName;

void verifyRange(int range);

void callback();

void setup()
{
  Wire.begin();
  WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  delay(3000);
  Serial.println("\n Starting");
  mySerial.begin(BAUDRATE);
  myMHZ19.begin(mySerial);
  myMHZ19.setRange(5000);
  myMHZ19.calibrateZero();
  myMHZ19.setSpan(5000);
  myMHZ19.autoCalibration(false);
  Serial.print("ABC Status: ");
  myMHZ19.getABC() ? Serial.println("ON") : Serial.println("OFF");
  pinMode(TRIGGER_PIN, INPUT);
  lightMeter.begin(BH1750::ONE_TIME_HIGH_RES_MODE);
  // wm.resetSettings(); // wipe settings

  // add a custom input field
  int customFieldLength = 40;

  new (&custom_field) WiFiManagerParameter("customfield", "Custom Field", "15", customFieldLength, "placeholder=\"Custom Field Placeholder\"");

  // test custom html input type(checkbox)
  // new (&custom_field) WiFiManagerParameter("customfieldid", "Custom Field Label", "Custom Field Value", customFieldLength,"placeholder=\"Custom Field Placeholder\" type=\"checkbox\""); // custom html type

  // test custom html(radio)
  // const char *custom_radio_str = "<br/><label for='customfieldid'>Custom Field Label</label><input type='radio' name='customfieldid' value='1' checked> One<br><input type='radio' name='customfieldid' value='2'> Two<br><input type='radio' name='customfieldid' value='3'> Three";
  // new (&custom_field) WiFiManagerParameter(custom_radio_str); // custom html input

  wm.addParameter(&custom_field);
  wm.setSaveParamsCallback(saveParamCallback);
  wm.setHostname("Bobby");
  // custom menu via array or vector
  //
  // menu tokens, "wifi","wifinoscan","info","param","close","sep","erase","restart","exit" (sep is seperator) (if param is in menu, params will not show up in wifi page!)
  // const char* menu[] = {"wifi","info","param","sep","restart","exit"};
  // wm.setMenu(menu,6);
  std::vector<const char *> menu = {"wifi", "info", "param", "sep", "restart", "exit"};
  wm.setMenu(menu);

  // set dark theme
  wm.setClass("invert");

  //set static ip
  // wm.setSTAStaticIPConfig(IPAddress(10,0,1,99), IPAddress(10,0,1,1), IPAddress(255,255,255,0)); // set static ip,gw,sn
  // wm.setShowStaticFields(true); // force show static ip fields
  // wm.setShowDnsFields(true);    // force show dns field always

  // wm.setConnectTimeout(20); // how long to try to connect for before continuing
  wm.setConfigPortalTimeout(30); // auto close configportal after n seconds
  // wm.setCaptivePortalEnable(false); // disable captive portal redirection
  wm.setAPClientCheck(true); // avoid timeout if client connected to softap

  // wifi scan settings
  // wm.setRemoveDuplicateAPs(false); // do not remove duplicate ap names (true)
  // wm.setMinimumSignalQuality(20);  // set min RSSI (percentage) to show in scans, null = 8%
  // wm.setShowInfoErase(false);      // do not show erase button on info page
  // wm.setScanDispPerc(true);       // show RSSI as percentage not graph icons

  // wm.setBreakAfterConfig(true);   // always exit configportal even if wifi save fails

  bool res;
  // res = wm.autoConnect(); // auto generated AP name from chipid
  // res = wm.autoConnect("AutoConnectAP"); // anonymous ap
  res = wm.autoConnect(SSID, WIFI_PASSWD); // password protected ap

  if (!res)
  {
    Serial.println("Failed to connect or hit timeout");
    // ESP.restart();
  }
  else
  {
    //if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");
    client.setServer(mqtt_server, 1883);
  }
}
void saveParamCallback()
{
  Serial.println("[CALLBACK] saveParamCallback fired");
  Serial.println("PARAM customfieldid = " + getParam("customfieldid"));
  Serial.println("PARAM customfielD = " + getParam("customfield"));
}
void checkButton()
{
  // check for button press
  if (digitalRead(TRIGGER_PIN) == LOW)
  {
    // poor mans debounce/press-hold, code not ideal for production
    delay(50);
    if (digitalRead(TRIGGER_PIN) == LOW)
    {
      Serial.println("Button Pressed");
      // still holding button for 3000 ms, reset settings, code not ideaa for production
      delay(3000); // reset delay hold
      if (digitalRead(TRIGGER_PIN) == LOW)
      {
        Serial.println("Button Held");
        Serial.println("Erasing Config, restarting");
        wm.resetSettings();
        ESP.restart();
      }

      // start portal w delay
      Serial.println("Starting config portal");
      wm.setConfigPortalTimeout(120);

      if (!wm.startConfigPortal("OnDemandAP", "password"))
      {
        Serial.println("failed to connect or hit timeout");
        delay(3000);
        // ESP.restart();
      }
      else
      {
        //if you get here you have connected to the WiFi
        Serial.println("connected...yeey :)");
        client.setServer(mqtt_server, 1883);

        clientName += "esp8266-";
        uint8_t mac[6];
        WiFi.macAddress(mac);
        clientName += macToStr(mac);
        clientName += "-";
        clientName += String(micros() & 0xff, 16);

        clientName.toCharArray(buf, 100);
      }
    }
  }
}

String getParam(String name)
{
  //read parameter from server, for customhmtl input
  String value;
  if (wm.server->hasArg(name))
  {
    value = wm.server->arg(name);
  }
  return value;
}

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void loop()
{
  checkButton();
  delay(500);
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;
    String payload = "{\"startMills\":";
    payload += (millis() - startMills);
    payload += "}";
    float hum = SHT2x.GetHumidity();
    float temp = SHT2x.GetTemperature();
    char currentTopic[100];
    strcpy(currentTopic, topic);
    strcat(currentTopic, "/temp");
    // use the string then delete it when you're done.
    free(currentTopic);
    sendmqttMsg(currentTopic, String(temp));

    strcpy(currentTopic, topic);
    strcat(currentTopic, "/humidity");
    sendmqttMsg(currentTopic, String(hum));
    // use the string then delete it when you're done.
    free(currentTopic);
    float lux = lightMeter.readLightLevel(true);
    strcpy(currentTopic, topic);
    strcat(currentTopic, "/lux");
    sendmqttMsg(currentTopic, String(lux));
    free(currentTopic);
    int CO2;
    CO2 = myMHZ19.getCO2();
    getDataTimer = millis(); // Update inerval
    strcpy(currentTopic, topic);
    strcat(currentTopic, "/co2");
    delay(1000);
    sendmqttMsg(currentTopic, String(CO2));

    free(currentTopic);
  }
  client.loop();
  client.connect(buf);
}

void sendmqttMsg(char *topictosend, String payload)
{

  if (client.connected())
  {
    Serial.print("Sending payload: ");
    Serial.print(payload);

    unsigned int msg_length = payload.length();

    Serial.print(" length: ");
    Serial.println(msg_length);

    byte *p = (byte *)malloc(msg_length);
    memcpy(p, (char *)payload.c_str(), msg_length);

    if (client.publish(topictosend, p, msg_length))
    {
      Serial.println("Publish ok");
      free(p);
      //return 1;
    }
    else
    {
      Serial.println("Publish failed");
      free(p);
      //return 0;
    }
  }
}

String macToStr(const uint8_t *mac)
{
  String result;
  for (int i = 0; i < 6; ++i)
  {
    result += String(mac[i], 16);
    if (i < 5)
      result += ':';
  }
  return result;
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1')
  {
    digitalWrite(BUILTIN_LED, LOW); // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  }
  else
  {
    digitalWrite(BUILTIN_LED, HIGH); // Turn the LED off by making the voltage HIGH
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(buf))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}