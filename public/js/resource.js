function createAccount() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.owner = document.getElementById("owner").value;
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/create-account", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Resource: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("name").value = "";
            document.getElementById("location").value = "";
            document.getElementById("description").value = "";
            document.getElementById("owner").value = "";
            window.location.href = 'index.html';
        } else {
            document.getElementById("message").innerHTML = 'Unable to add resource!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function viewAccounts() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-accounts', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].owner + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning"onclick="editResource(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + '<button type="button" class="btn btn-danger"onclick="deleteResource(' + response[i].id + ')"> Delete</button>' + '</td>' + '</tr>'
        }
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();

}

    function editResource(data) {
        var selectedResource = JSON.parse(data);

        document.getElementById("Change Username").value = selectedResource.name;
        document.getElementById("Change Password").value = selectedResource.location;
        document.getElementById("Confirm Password").value = selectedResource.description;
        document.getElementById("updateButton").setAttribute("onclick", 'updateResource("' + selectedResource.id + '")');

        $('#editResourceModal').modal('show');
    }

    function updateResource(id) {
        console.log(id)
        var response = "";
        var jsonData = new Object();
        jsonData.name = document.getElementById("Change Username").value;
        jsonData.location = document.getElementById("Change Password").value;
        jsonData.description = document.getElementById("Confirm Password").value;
        if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "" || jsonData.owner == "") {
            document.getElementById("editMessage").innerHTML = 'All fields are required!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
            return;
        }
        var request = new XMLHttpRequest();
        request.open("PUT", "/edit-resource/" + id, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            response = JSON.parse(request.responseText);
            if (response.message == "Resource modified successfully!") {
                document.getElementById("editMessage").innerHTML = 'Edited Resource: ' + jsonData.name + '!';
                document.getElementById("editMessage").setAttribute("class",
                    "text-success");
                window.location.href = 'index.html';
            }
            else {
                document.getElementById("editMessage").innerHTML = 'Unable to edit resource!';
                document.getElementById("editMessage").setAttribute("class", "text-danger");
            }
        };
        request.send(JSON.stringify(jsonData));
    }

    function deleteResource(selectedId) {
        var response = "";
        var request = new XMLHttpRequest();
        request.open("DELETE", "/delete-resource/" + selectedId, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            response = JSON.parse(request.responseText);
            if (response.message == "Resource deleted successfully!") {
                window.location.href = 'index.html';
            }
            else {
                alert('Unable to delete resource!');
            }
        };
        request.send();
    }

