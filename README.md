# Hooks deploy
The script for deploying apps via hooks.

Dependencies:
* nodejs
* git
* tar

### Usage
Running:
```
$ hooks-deploy
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
    -d '{"name":"foo","repository": "https://*","branch": "master"}' \
    --url http://localhost:7999/
```

Configuration file example:
```json
{
  "port": 7999,
  "hooks": [
    {
      "name": "foo",
      "path": "/mnt/sda/",
      "cmd": "node app.js"
    }
  ]
}
```

