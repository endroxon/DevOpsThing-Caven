const { Resource } = require('../models/Resource');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function createAccount(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const email = req.body.email;

        if (!email.includes('@') || !email.includes('.') || confirmpassword.length < 6) {
            return res.status(500).json({ message: 'Validation error: Invalid email or password too short' });
        }
        if (password !== confirmpassword) {
            return res.status(500).json({ message: 'Validation error: Passwords do not match' });
        }

        const newResource = new Resource(username, password, confirmpassword, email);
        const updatedResources = await writeJSON(newResource, 'utils/resources.json');
        return res.status(201).json(updatedResources);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewAccounts(req, res) {
    try {
        const allResources = await readJSON('utils/resources.json');
        return res.status(201).json(allResources);
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
        const allResources = await readJSON('utils/resources.json');
        var modified = false;

        for (var i = 0; i < allResources.length; i++) {
            var currentResource = allResources[i];
            if (currentResource.id == id) {
                allResources[i].username = username;
                allResources[i].password = password;
                allResources[i].confirmpassword = confirmpassword;
                modified = true;
            }
        }

        if (modified) {
            await fs.writeFile('utils/resources.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteAccount(req, res) {
    try {
        const id = req.params.id;
        const allResources = await readJSON('utils/resources.json');
        var index = -1;

        for (var i = 0; i < allResources.length; i++) {
            var currentResource = allResources[i];
            if (currentResource.id == id)
                index = i;
        }

        if (index != -1) {
            allResources.splice(index, 1);
            await fs.writeFile('utils/resources.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, createAccount, viewAccounts, updateAccount, deleteAccount
};
