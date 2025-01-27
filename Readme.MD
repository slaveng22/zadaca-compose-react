# Build images

## Messenger
```bash
cd ./messageboard/front
docker build -t messenger:test .
```

## Voter
```bash
cd ../../votingapp/front/
docker build -t voter:test .
```

## Reverse proxy
```bash
cd ../../rproxy/
docker build -t reverse-proxy:test .
```

# Create network
```bash
docker network create --driver bridge moja-mreza
```

# Run containers

## Messenger
```bash
docker run -d --name messenger --network moja-mreza --hostname messenger messenger:test
```
## Voter
```bash
docker run -d --name voter --network moja-mreza --hostname voter voter:test
```

## Proxy
```bash
docker run -d -p 80:80 --name reverse-proxy --network moja-mreza --hostname proxy reverse-proxy:test
```

# Services

## Messenger
http://messenger

## Voter
http://voter

## Proxy
http://reverse-proxy

### Manipulate hosts file

#### Windows

- To add internal domain, open PowerShell as admin and run

```Powershell
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.2`t*.slaven.internal" -Force
```

- To remove internal domain, open PowerShell as admin and run

```Powershell
 (Get-Content -Path $env:windir\System32\drivers\etc\hosts) | Where-Object { $_ -notmatch "127.0.0.2`t\*\.slaven\.internal" } | Set-Content -Path $env:windir\System32\drivers\etc\hosts
```

#### Linux
- To add internal domain, open terminal and run

```bash
echo -e "\n127.0.0.2\t*.slaven.internal" | sudo tee -a /etc/hosts > /dev/null
```

- To remove internal domain, open terminal and run

```bash
sudo sed -i '/127\.0\.0\.2.*\.slaven\.internal/d' /etc/hosts
```

### Redirect

- https://mydomain.com/messenger ---> http://messenger:30001
- https://mydomain.com/voter ---> http://voter:40001

# Certificate
