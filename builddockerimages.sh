cd ./messageboard/front
docker build -t slaveng/messageboard-front:react .
docker push slaveng/messageboard-front:react

cd ../back
docker build -t slaveng/messageboard-api:react .
docker push slaveng/messageboard-api:react

cd ../../votingapp/front
docker build -t slaveng/votingapp-front:react .
docker push slaveng/votingapp-front:react

cd ../back
docker build -t slaveng/votingapp-api:react .
docker push slaveng/votingapp-api:react

cd ../../rproxy/
docker build -t slaveng/reverse-proxy:react .
docker push slaveng/reverse-proxy:react
