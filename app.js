var http = require('http');
var url = require('url');
var fs = require('fs');

const TEXTFILENAME = 'NAMES.TXT'
function readUsernames(textFilename) {
    var usernames = new Set();
    try {  
        var data = fs.readFileSync(textFilename, 'utf8');
        usernames = data.toString().toLowerCase().split('\r\n');
    } catch(e) {
        console.log('Error:', e.stack);
    }    
    return usernames
}

const USERNAMES = readUsernames(TEXTFILENAME);
function usernameAvailable(username) {
    return USERNAMES.indexOf(username) === -1;
}

http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var query = parsedUrl.query;
    const lowerCaseUsername = query.username.toLowerCase()
    const available = { username: lowerCaseUsername, available: usernameAvailable(lowerCaseUsername) };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(available));
}).listen(8080);


console.log('Server running on port 8080 with ', USERNAMES.length, 'usernames');
console.log('GET http://localhost:8080?username=USERNAME to check if given USERNAME is available.');
console.log('Sample response: {"username":"tom","available":false}')
