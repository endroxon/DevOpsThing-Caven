var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "movie.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addMovie,viewMovie, editMovie, deleteMovie } = require('./utils/MovieUtils')
app.post('/add-movie', addMovie);
app.get('/view-movie', viewMovie);
app.put('/edit-movie/:id', editMovie);
app.delete('/delete-movie/:id', deleteMovie);
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