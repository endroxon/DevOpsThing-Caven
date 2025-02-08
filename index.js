var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const logger = require('./logger');

const PORT = process.env.PORT || 5054
var startPage = "account.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

const { createAccount, viewAccounts } = require('./utils/AccountUtil.js')
app.post('/create-account', createAccount);

app.get('/view-accounts', viewAccounts);



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
    logger.info(`Demo project at: ${baseUrl}!`);
    logger.error(`Example or error log`)
});

module.exports = { app, server }