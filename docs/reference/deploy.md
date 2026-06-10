# Deploy info

## Domen and ip

- Domen: `ec2-51-20-182-189.eu-north-1.compute.amazonaws.com`
- Ip: `51.20.182.189`

## Opened ports:

- SSH: `22`
- HTTPS: `443`
- Custom: `5173`

## Access to Backend Service

Has access to backend via:
- Domen: `ec2-51-21-218-154.eu-north-1.compute.amazonaws.com`
- Ip: `51.21.218.154`

### How to test access

- Connect to ssh and write to terminal:

```bash
ubuntu@ip-172-31-22-14:~/Frontend$ curl 51.21.218.154:8080/health
```

- Then receive response from application:

```json
{"data":{"status":"OK"}}
```
