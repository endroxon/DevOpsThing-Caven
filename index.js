var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5054
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { createAccount, viewAccounts, updateAccount, deleteAccount  } = require('./utils/ResourceUtil')
app.post('/create-account', createAccount);

app.get('/view-accounts', viewAccounts);
app.put('/edit-resource/:id', updateAccount);
app.delete('/delete-resource/:id', deleteAccount);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server }