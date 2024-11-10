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

function updateAccount(data) {
    var selectedAccount = JSON.parse(data);

    document.getElementById("Change Username").value = selectedAccount.username;
    document.getElementById("Change Password").value = selectedAccount.password;
    document.getElementById("Confirm Password").value = selectedAccount.confirmpassword;
    document.getElementById("updateButton").setAttribute("onclick", 'updateAccountDetails("' + selectedAccount.id + '")');

    $('#editAccountModal').modal('show');
}

function updateAccountDetails(id) {
    console.log(id);
    var response = "";
    var jsonData = new Object();
    jsonData.username = document.getElementById("Change Username").value;
    jsonData.password = document.getElementById("Change Password").value;
    jsonData.confirmpassword = document.getElementById("Confirm Password").value;
    
    if (jsonData.username == "" || jsonData.password == "" || jsonData.confirmpassword == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", "/update-account/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Account modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Account: ' + jsonData.username + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'account.html';
        } else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit account!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function deleteAccount(selectedId) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-account/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Account deleted successfully!") {
            window.location.href = 'account.html';
        } else {
            alert('Unable to delete account!');
        }
    };
    request.send();
}
