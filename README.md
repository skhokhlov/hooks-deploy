# Hooks deploy
[![npm version](https://badge.fury.io/js/hooks-deploy.svg)](http://badge.fury.io/js/hooks-deploy)

The script for deploying apps via hooks.

Dependencies:
* node.js
* git
* tar

### Usage
Installing:
```
$ npm install -g hooks-deploy
```

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
$ curl \
    -X POST \
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

