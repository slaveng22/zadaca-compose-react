# Introduction
- 2 React apps and 2 apis running in docker containers
- Nginx reverse proxy exposing 2 apps to your host loopback network
- Postgres database running in docker container with pesistant storage
- All containers running in custom bridge network called "my-network" and they can comunicate in this network
- Apps can be rached on internal subdomains "messenger.slaven.internal" and "voter.slaven.internal"
- Follow instructions to add domain to your hostfile and to install certificate.

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

## Database
- postgres-database:5432

## Proxy
- http://reverse-proxy

### Redirect

- https://messenger.slaven.internal ---> http://messageboard-front
- https://messenger.slaven.internal/api ---> http://messageboard-api:30001
- https://voter.slaven.internal ---> http://votingapp-front
- https://voter.slaven.internal/api ---> http://votingapp-api:40001

# .env file

- Don't forget to create .env file in the root directory of this project
- Template

```
POSTGRES_USER=postgres
POSTGRES_HOST=postgres-database
POSTGRES_DB_MESSAGE=message_board
POSTGRES_DB_VOTE=voting_app
POSTGRES_PASSWORD=<Enter some password for Postgres>
POSTGRES_PORT=5432
```

# Manipulate hosts file on Windows machine

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

# Install certificate on your Windows machine

- Download certificate **slaven.crt** from git repo

- Open PowerShell as admin and run this script to import certificate
```PowerShell
$certpath=Read-Host -Prompt "Eneter path to the downloaded certificate"
if (!(Test-Path -Path $certpath)){
Write-Error -Message "Path to the certificate doesn't exist!" -RecommendedAction "Run script again and enter new path!"
}
try {
    Get-ChildItem -Path $certpath | Import-Certificate -CertStoreLocation Cert:\LocalMachine\Root
    Write-Host "Certificate imported successfully."
}
catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
}
```

- To remove certificate, open PowerShell as admin and run following script
```Powershell
$cert = Get-ChildItem -Path "Cert:\LocalMachine\Root" | Where-Object {$_.Subject -like "*CN=*.slaven*"}
if ($cert) {
	Remove-Item -Path $cert.PSPath -Force
	Write-Host "Certificate removed successfully."
}
else {
	Write-Warning "Certificate with subject 'CN=*.slaven' not found."
}
``` 

