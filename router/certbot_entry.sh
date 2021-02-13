#!/bin sh

echo "################################## Run CERTBOT"
trap exit TERM; 
while :; 
do certbot renew; sleep 12h & wait $${!}; 
done;