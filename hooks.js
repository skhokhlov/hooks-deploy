var http = require('http');
var exec = require('child_process').exec;

var config = require('./config.json');
var hookNames = [];

for (var i = 0; i < config.hooks.length; ++i) {
    if (Boolean(config.hooks[i].name && config.hooks[i].path && config.hooks[i].cmd)) {
        hookNames.push(config.hooks[i].name);

    } else {
        throw new Error('Invalid config file');
    }

}

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
        var body = '';
        req.on('data', function (chunk) {
            body += String(chunk);
        });

        req.on('end', function () {
            body = JSON.parse(body);
            if (!Boolean(body.name && body.repository && body.branch)) {
                res.writeHead(400, 'Bad Request');
                res.end('400 Bad Request');
            }

            if (hookNames.indexOf(body.name) > -1) {
                var hook = config.hooks[hookNames.indexOf(body.name)];
                var cmd = 'cd {hook.path} && git clone {body.repository} {body.branch} -b {body.branch} ' +
                    '&& cd {body.branch} && {hook.cmd}';
                cmd = cmd.replace(new RegExp('{hook.path}', 'g'), hook.path)
                    .replace(new RegExp('{body.repository}', 'g'), body.repository)
                    .replace(new RegExp('{body.branch}', 'g'), body.branch)
                    .replace(new RegExp('{hook.cmd}', 'g'), hook.cmd);

                exec(cmd, function (err, stdout) {
                    if (err) {
                        res.writeHead(500, 'Internal Server Error');
                        res.end('500 Internal Server Error\n' + err);
                    }

                    res.writeHead(200, 'OK');
                    res.end(stdout);
                });
                
            } else {
                res.writeHead(404, 'Not Found');
                res.end('404');
            }

        })

    } else {
        res.writeHead(405, 'Method not supported', {'Content-Type': 'text/html'});
        res.end('<html><head><title>405 - Method not supported</title></head>' +
        '<body><h1>Method not supported.</h1></body></html>');
    }

})
    .listen(process.env.PORT || 7999);
