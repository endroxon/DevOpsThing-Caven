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

async function viewAccounts(req, res) {
    try {
        const allAccounts = await readJSON('utils/accounts.json'); 
        return res.status(201).json(allAccounts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function createAccount(req, res) {
    try {
        const { username, password, confirmpassword, email } = req.body;

        
        if (!username || !password || !confirmpassword || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        

      
        const newAccount = new Account(username, password, confirmpassword, email);
        const updatedAccounts = await writeJSON(newAccount, 'utils/accounts.json');
        return res.status(201).json(updatedAccounts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    readJSON, writeJSON, createAccount, viewAccounts
};