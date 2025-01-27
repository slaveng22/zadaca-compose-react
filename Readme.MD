# Introduction
- 2 React apps and 2 apis running in docker containers
- Nginx reverse proxy exposing 2 apps to your host loopback network
- Postgres database running in docker container with pesistant storage
- All containers running in custom bridge network called "my-network" and they can comunicate in this network
- Apps can be rached on internal subdomains "voter.slaven.internal" and "voter.slaven.internal"
- Follow instructions to add domain to your hostfile and to create certificate

# Services

## Messenger
http://messageboard-front
http://messageboard-api:30001

## Voter
http://votingapp-front
http://votingapp-api:40001

## Proxy
http://reverse-proxy

### Redirect

- https://messenger.slaven.internal ---> http://messageboard-front
- https://messenger.slaven.internal/api ---> http://messageboard-api:30001
- https://voter.slaven.internal ---> http://votingapp-front
- https://voter.slaven.internal/api ---> http://votingapp-api:40001


### Manipulate hosts file

#### Windows

- To add internal domain, open PowerShell as admin and run

```Powershell
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.1`tmessenger.slaven.internal" -Force
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.1`t*voter.internal"
```

- To remove internal domain, open PowerShell as admin and run

```Powershell
(Get-Content -Path $env:windir\System32\drivers\etc\hosts) | Where-Object { $_ -notmatch "127.0.0.1\s+tmessenger.slaven.internal" } | Set-Content -Path $env:windir\System32\drivers\etc\hosts
(Get-Content -Path $env:windir\System32\drivers\etc\hosts) | Where-Object { $_ -notmatch "127.0.0.1\s*voter.internal" } | Set-Content -Path $env:windir\System32\drivers\etc\hosts
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


# Certificate
