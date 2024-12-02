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

        if (username && username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

         // Check if all fields are missing
         if (!username && !password && !confirmpassword && !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        if (!username) {
            return res.status(500).json({ message: 'Username is required' });
        }

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


module.exports = {
    readJSON, writeJSON, createAccount
};
