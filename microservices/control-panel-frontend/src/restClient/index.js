const { SOAPClient } = require('./lib/soap-client');
const { RestClient, rest } = require('./lib/rest-client');
const { FetchWrap } = require('./lib/fetchWrapper');
async function run() {
	const res = new SOAPClient(
		'https://www.crcind.com/csp/samples/SOAP.Demo.CLS'
	);
	const Json2Xml = await res.get('?WSDL=1');
	console.log(Json2Xml);
}
// run();

module.exports = { FetchWrap, RestClient, SOAPClient, rest };
