#!/bin/bash
docker stop $(docker ps -q)
docker rm $(docker ps -a -q)
for img in $(docker images -q); do docker image rm $img -f; done
docker system prune -af
