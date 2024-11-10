const { Resource } = require('../models/Moviemodel');
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
async function addMovie(req, res) {
    try {
        const movies = req.body.movies;
        const location = req.body.location;
        const description = req.body.description;
        const owner = req.body.owner;
        if (!owner.includes('@') || !owner.includes('.') || description.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newResource = new Resource(movies, location, description, owner);
            const updatedResources = await writeJSON(newResource,
                'Utils/Database.json');
            return res.status(201).json(updatedResources);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewMovie(req, res) {
    try {
        const allResources = await readJSON('Utils/Database.json');
        return res.status(201).json(allResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editMovie(req, res) {
    try {
        const id = req.params.id;
        const movies = req.body.movies;
        const location = req.body.location;
        const description = req.body.description;
        const allResources = await readJSON('Utils/Database.json');
        var modified = false;
        for (var i = 0; i < allResources.length; i++) {
            var curcurrResource = allResources[i];
            if (curcurrResource.id == id) {
                allResources[i].movies = movies;
                allResources[i].location = location;
                allResources[i].description = description;
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile('Utils/Database.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteMovie(req, res) {
    try {
        const id = req.params.id;
        const allResources = await readJSON('Utils/Database.json');
        var index = -1;
        for (var i = 0; i < allResources.length; i++) {
            var curcurrResource = allResources[i];
            if (curcurrResource.id == id)
                index = i;
        }
        if (index != -1) {
            allResources.splice(index, 1);
            await fs.writeFile('Utils/Database.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addMovie,viewMovie, editMovie, deleteMovie
};