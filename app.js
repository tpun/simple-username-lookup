var fs = require('fs');
var express = require('express');
var app = express();


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

app.get('/lookup', (req, res) => {
    const lowerCaseUsername = req.query.username.toLowerCase()
    const available = { username: lowerCaseUsername, available: usernameAvailable(lowerCaseUsername) };
    res.json(available);
});

app.get('/', (req, res) => {
    res.send('Mock usernmae lookup service: /lookup?username=USERNAME');
 });
 
 var server = app.listen(8080, () => {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Mock username lookup service running at http://%s:%s with %i usernames.", host, port, USERNAMES.length)
    console.log('GET http://%s:%s/lookup?username=USERNAME to check if given USERNAME is available.', host, port);
    console.log('Sample response: {"username":"tom","available":false}')
 });
