const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nightlifeSchema = new Schema({
    username: String,
    barid: String
});

const Nightlife = mongoose.model('nightlife', nightlifeSchema);

module.exports = Nightlife;