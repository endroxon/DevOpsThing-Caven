const { Account } = require('../models/Account'); 
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function createAccount(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const email = req.body.email;

        if (!email.includes('@') || !email.includes('.') || confirmpassword.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        } else {
            // Replace Resource with Account
            const newAccount = new Account(username, password, confirmpassword, email); 
            const updatedAccounts = await writeJSON(newAccount, 'utils/accounts.json');
            return res.status(201).json(updatedAccounts);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewAccounts(req, res) {
    try {
        const allAccounts = await readJSON('utils/accounts.json'); 
        return res.status(201).json(allAccounts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateAccount(req, res) {
    try {
        const id = req.params.id;
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const allAccounts = await readJSON('utils/accounts.json'); 
        var modified = false;
        for (var i = 0; i < allAccounts.length; i++) {
            var curcurrAccount = allAccounts[i]; 
            if (curcurrAccount.id == id) {
                allAccounts[i].username = username;
                allAccounts[i].password = password;
                allAccounts[i].confirmpassword = confirmpassword;
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile('utils/accounts.json', JSON.stringify(allAccounts), 'utf8'); 
            return res.status(201).json({ message: 'Account modified successfully!' }); 
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify account!' }); 
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteAccount(req, res) {
    try {
        const id = req.params.id;
        const allAccounts = await readJSON('utils/accounts.json'); 
        var index = -1;
        for (var i = 0; i < allAccounts.length; i++) {
            var curcurrAccount = allAccounts[i]; 
            if (curcurrAccount.id == id) index = i;
        }
        if (index != -1) {
            allAccounts.splice(index, 1); 
            await fs.writeFile('utils/accounts.json', JSON.stringify(allAccounts), 'utf8'); 
            return res.status(201).json({ message: 'Account deleted successfully!' }); 
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete account!' }); 
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, createAccount, viewAccounts, updateAccount, deleteAccount
};
