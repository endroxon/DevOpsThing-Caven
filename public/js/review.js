function addReview() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.rating = document.getElementById("rating").value;
    jsonData.owner = document.getElementById("owner").value;
    if (jsonData.name == "" || jsonData.description == "" || jsonData.rating == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/add-review", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Review: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("name").value = "";
            document.getElementById("description").value = "";
            document.getElementById("rating").value = "";
            document.getElementById("owner").value = "";
            window.location.href = 'review.html';
        } else {
            document.getElementById("message").innerHTML = 'Unable to add review!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function viewReview() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-reviews', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].description + '</td>' +
                '<td>' + response[i].rating + '</td>' +
                '<td>' + response[i].owner + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning"onclick="editReview(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + '<button type="button" class="btn btn-danger"onclick="deleteReview(' + response[i].id + ')"> Delete</button>' + '</td>' + '</tr>'
        }
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();

}

    function editReview(data) {
        var selectedReview = JSON.parse(data);

        document.getElementById("editName").value = selectedReview.name;
        document.getElementById("editDescription").value = selectedReview.description;
        document.getElementById("editRating").value = selectedReview.rating;
        document.getElementById("editOwner").value = selectedReview.owner;
        document.getElementById("updateButton").setAttribute("onclick", 'updateReview("' + selectedReview.id + '")');

        $('#editReviewModal').modal('show');
    }

    function updateReview(id) {
        console.log(id)
        var response = "";
        var jsonData = new Object();
        jsonData.name = document.getElementById("editName").value;
        jsonData.description = document.getElementById("editDescription").value;
        jsonData.rating = document.getElementById("editRating").value;
        jsonData.owner = document.getElementById("editOwner").value;
        if (jsonData.name == "" || jsonData.description == "" || jsonData.rating == "" || jsonData.owner == "") {
            document.getElementById("editMessage").innerHTML = 'All fields are required!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
            return;
        }
        var request = new XMLHttpRequest();
        request.open("PUT", "/edit-review/" + id, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            response = JSON.parse(request.responseText);
            if (response.message == "Review edited successfully!") {
                document.getElementById("editMessage").innerHTML = 'Edited Review: ' + jsonData.name + '!';
                document.getElementById("editMessage").setAttribute("class", "text-success");
                window.location.href = 'review.html';
            }
            else {
                document.getElementById("editMessage").innerHTML = 'Unable to edit Review!';
                document.getElementById("editMessage").setAttribute("class", "text-danger");
            }
        };
        request.send(JSON.stringify(jsonData));
    }

    function deleteReview(selectedId) {
        var response = "";
        var request = new XMLHttpRequest();
        request.open("DELETE", "/delete-review/" + selectedId, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            response = JSON.parse(request.responseText);
            if (response.message == "Review deleted successfully!") {
                window.location.href = 'review.html';
            }
            else {
                alert('Unable to delete review!');
            }
        };
        request.send();
    }

