var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "account.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./instrumented"));

const { createAccount, viewAccounts } = require('./utils/AccountUtil.js')
app.post('/create-account', createAccount, viewAccounts);
app.get('/view-accounts', viewAccounts);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/instrumented/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server }