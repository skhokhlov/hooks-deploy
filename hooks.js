var http = require('http');
var url = require('url');
var exec = require('child_process').exec();
var fs = require('fs');

var config = null;
var hookNames = [];
fs.readFile(__dirname + '/config.json', {encoding: 'utf-8'}, function (err, data) {
    if (err) {
        throw new Error(err);
    }

    config = JSON.parse(data);

    for (var i = 0; i < config.hooks.length; ++i) {
        hookNames.push(config.hooks[i].name);
    }
});

http.createServer(function (req, res) {
    if (req.method === 'POST') {
        /**
         * body example:
         * {
         *  "name":"foo",
         *  "repository": "https://*",
         *  "branch": "master"
         * }
         */
        var body;
        req.on('data', function (chunk) {
            console.log(chunk.toString());
            body += chunk;
        });

        res.on('end', function () {

            body = JSON.parse(body);
            if(body.name && body.repository && body.branch){
                res.writeHead(400, 'Bad Request');
                res.end('400 Bad Request');
            }
            console.log(body.name && body.repository && body.branch);

            if (hookNames.indexOf(body.name) > -1) {
                var index = hookNames.indexOf(body.name);
                exec('wget ' + body.repository + '/archive/' + body.branch + '.tar.gz ' +
                '-O' + config.hooks[index].path + body.branch + '.tar.gz' +
                    ' && tar xf ' + config.hooks[index].path + body.branch + '.tar.gz' +
                    ' && ' + config.hooks[index].cmd + ' &', function(err){
                    if (err){
                        res.writeHead(500, 'Internal Server Error', {'Content-Type': 'text/html'});
                        res.end('<html><head><title>500 - Internal Server Errord</title></head>' +
                        '<body><h1>Internal Server Error.</h1></body></html><!-- ' + err + '-->');
                    }

                    res.writeHead(200, "OK");
                    res.end('OK');
                });
            }

        })

    } else {
        res.writeHead(405, 'Method not supported', {'Content-Type': 'text/html'});
        res.end('<html><head><title>405 - Method not supported</title></head>' +
        '<body><h1>Method not supported.</h1></body></html>');
    }

})
    .listen(7999);
