function createAccount() {
    var response = "";
    var jsonData = new Object();
    jsonData.username = document.getElementById("username").value;
    jsonData.password = document.getElementById("password").value;
    jsonData.confirmpassword = document.getElementById("confirmpassword").value;
    jsonData.email = document.getElementById("email").value;
    
    if (jsonData.username == "" || jsonData.password == "" || jsonData.confirmpassword == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    

    var request = new XMLHttpRequest();
    request.open("POST", "/create-account", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Account: ' + jsonData.username + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmpassword").value = "";
            document.getElementById("email").value = "";
            window.location.href = 'account.html';
        } else {
            document.getElementById("message").innerHTML = 'Unable to add account!';
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
        var html = '';
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].email + '</td>' +
                '<td>' + response[i].username + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning" onclick="updateAccount(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + 
                '<button type="button" class="btn btn-danger" onclick="deleteAccount(' + response[i].id + ')"> Delete</button>' + 
                '</td>' + 
                '</tr>';
        }
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();
}

