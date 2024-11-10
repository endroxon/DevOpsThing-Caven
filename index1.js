var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addMovie,viewMovie, editMovie, deleteMovie } = require('./utils/MovieUtils')
app.post('/add-movie', addMovie);
app.get('/view-movie', viewMovie);
app.put('/edit-movie/:id', editMovie);
app.delete('/delete-movie/:id', deleteMovie);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { createAccount, viewAccounts, updateAccount, deleteAccount  } = require('./utils/AccountUtil.js')
app.post('/create-account', createAccount);

app.get('/view-accounts', viewAccounts);
app.put('/update-account/:id', updateAccount);
app.delete('/delete-account/:id', deleteAccount);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addReview, viewReview, editReview, deleteReview  } = require('./utils/ReviewUtil')
app.post('/add-review', addReview);
app.get('/view-reviews', viewReview);
app.put('/edit-review/:id', editReview);
app.delete('/delete-review/:id', deleteReview);


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