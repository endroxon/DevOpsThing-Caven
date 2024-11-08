class Resource {
    constructor(movie, location, description, owner) {
    this.movie = movie;
    this.location = location;
    this.description = description;
    this.owner = owner;
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
    }
    module.exports = { Resource };