#!/usr/bin/env bash

echo "################################## Run nginx"
while :; 
do sleep 6h & wait ${!}; 
nginx -s reload; done &
export DOLLAR='$'
envsubst < ./router/${ENV_MODE}.nginx.conf > /etc/nginx/nginx.conf # /etc/nginx/conf.d/default.conf 
nginx -g "daemon off;"