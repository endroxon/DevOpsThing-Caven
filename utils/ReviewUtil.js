const { Review } = require('../models/Review');
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
async function addReview(req, res) {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const rating = req.body.rating;
        const owner = req.body.owner;
        if (!owner.includes('@') || !owner.includes('.') || description.length < 6 || rating > 10) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newReview = new Review(name, description, rating, owner);
            const updatedReviews = await writeJSON(newReview,
                'utils/reviews.json');
            return res.status(201).json(updatedReviews);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewReview(req, res) {
    try {
        const allReviews = await readJSON('utils/reviews.json');
        return res.status(201).json(allReviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editReview(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        const rating = req.body.rating;
        const allReviews = await readJSON('utils/reviews.json');
        var edited = false;
        for (var i = 0; i < allReviews.length; i++) {
            var curcurrReview = allReviews[i];
            if (curcurrReview.id == id) {
                allReviews[i].name = name;
                allReviews[i].description = description;
                allReviews[i].rating = rating;
                edited = true;
            }
        }
        if (edited) {
            await fs.writeFile('utils/reviews.json', JSON.stringify(allReviews), 'utf8');
            return res.status(201).json({ message: 'Review edited successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to edited!' });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async function deleteReview(req, res) {
    try {
        const id = req.params.id;
        const allReviews = await readJSON('utils/reviews.json');
        var index = -1;
        for (var i = 0; i < allReviews.length; i++) {
            var curcurrReview = allReviews[i];
            if (curcurrReview.id == id)
                index = i;
        }
        if (index != -1) {
            allReviews.splice(index, 1);
            await fs.writeFile('utils/reviews.json', JSON.stringify(allReviews), 'utf8');
            return res.status(201).json({ message: 'Review deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addReview, viewReview, editReview, deleteReview
};