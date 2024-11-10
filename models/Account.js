<<<<<<< HEAD
class Account {
    constructor(username, password, confirmpassword, email) {
        this.username = username;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.email = email;
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
=======
class Account {
    constructor(username, password, confirmpassword, email) {
        this.username = username;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.email = email;
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
>>>>>>> d0f1db5bd625afb6234951299d880989cc73477e
module.exports = { Account };