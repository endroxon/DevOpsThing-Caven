function addMovie() {
    var response = "";
    var jsonData = new Object();
    jsonData.movies = document.getElementById("movies").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.owner = document.getElementById("owner").value;
    if (jsonData.movies == "" || jsonData.location == "" || jsonData.description == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/add-movie", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Resource: ' +
                jsonData.movies + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("movies").value = "";
            document.getElementById("location").value = "";
            document.getElementById("description").value = "";
            document.getElementById("owner").value = "";
            window.location.href = 'movie.html';
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to add movie!';
            document.getElementById("message").setAttribute("class", "text-danger");
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function viewMovie() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-movie', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].movie + '</td>' +
                '<td>' + response[i].location + '</td>' +
                '<td>' + response[i].description + '</td>' +
                '<td>' + response[i].owner + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning" onclick = "editMovie(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + '<button type="button" class="btn btn-danger" onclick = "deleteMovie(' + response[i].id + ')" > Delete</button > ' + '</td>' + '</tr>'
        }
        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}

function editMovie(data) {
    var selectedResource = JSON.parse(data);

    document.getElementById("editName").value = selectedResource.movie;
    document.getElementById("editLocation").value = selectedResource.location;
    document.getElementById("editDescription").value = selectedResource.description;
    document.getElementById("editOwner").value = selectedResource.owner;

    document.getElementById("updateButton").setAttribute("onclick", 'updateMovie("' + selectedResource.id + '")');
    $('#editResourceModal').modal('show');
}

function updateMovie(id) {
    console.log(id)
    var response = "";

    var jsonData = new Object();
    jsonData.movies = document.getElementById("editName").value;
    jsonData.location = document.getElementById("editLocation").value;
    jsonData.description = document.getElementById("editDescription").value;
    jsonData.owner = document.getElementById("editOwner").value;
    if (jsonData.movies == "" || jsonData.location == "" || jsonData.description == "" ||
        jsonData.owner == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-movie/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Resource modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Resource: ' +
                jsonData.movies + '!';
            document.getElementById("editMessage").setAttribute("class",
                "text-success");
            window.location.href = 'movie.html';
        }
        else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit resource!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function deleteMovie(selectedId) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-movie/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Resource deleted successfully!") {
            window.location.href = 'movie.html';
        }
        else {
            alert('Unable to delete resource!');
        }
    };
    request.send();
}