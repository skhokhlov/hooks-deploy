# Hooks deploy
The script for deploying apps via hooks.

Dependings:
* nodejs
* git
* tar

### Running
```
node hooks.js
```
You can set port:
```
PORT=9999 node hooks.js
```

For usage you should send HTTP POST request to your server with body.
Body example:
```json
{
  "name":"foo",
  "repository": "https://*",
  "branch": "master"
}
```
You can do it with curl:
```
curl -X POST \
    -d {"name":"foo","repository": "https://*","branch": "master"} \
    --url http://localhost:7999/
```

Configuration file example:
```json
{
  "hooks": [
    {
      "name": "foo",
      "path": "/mnt/sda/",
      "cmd": "node app.js"
    }
  ]
}
```

