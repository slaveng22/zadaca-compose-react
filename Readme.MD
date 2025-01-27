# Introduction
- 2 React apps and 2 apis running in docker containers
- Nginx reverse proxy exposing 2 apps to your host loopback network
- Postgres database running in docker container with pesistant storage
- All containers running in custom bridge network called "my-network" and they can comunicate in this network
- Apps can be rached on internal subdomains "messenger.slaven.internal" and "voter.slaven.internal"
- Follow instructions to add domain to your hostfile

# Run containers and create network and volume

```bash
docker-compose up -d
```

# Stop and remove containers and networks

```bash
docker-compose down 
```

# Services

## Messenger
- http://messageboard-front
- http://messageboard-api:30001

## Voter
- http://votingapp-front
- http://votingapp-api:40001

## Proxy
- http://reverse-proxy

### Redirect

- http://messenger.slaven.internal ---> http://messageboard-front
- http://messenger.slaven.internal/api ---> http://messageboard-api:30001
- http://voter.slaven.internal ---> http://votingapp-front
- http://voter.slaven.internal/api ---> http://votingapp-api:40001

# .env file

- Don't forget to create .env file in the root directory of this project
- Template

```
POSTGRES_USER=postgres
POSTGRES_HOST=postgres-database
POSTGRES_DB_MESSAGE=message_board
POSTGRES_DB_VOTE=voting_app
POSTGRES_PASSWORD=<enter the password for your database>
POSTGRES_PORT=543
```

### Manipulate hosts file on Windows machine

- To add internal domain, open PowerShell as admin and run

```Powershell
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.1`tmessenger.slaven.internal" -Force
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n127.0.0.1`tvoter.slaven.internal"
```

- To remove internal domain, open PowerShell as admin and run

```Powershell
$hostsFile = "$env:windir\System32\drivers\etc\hosts"
$lines = Get-Content -Path $hostsFile
$updatedLines = $lines | Where-Object { $_ -notmatch "127.0.0.1\s+messenger.slaven.internal" -and $_ -notmatch "127.0.0.1\s+voter.slaven.internal" }
$updatedLines | Set-Content -Path $hostsFile
```
