const mongoose = require("mongoose");

const blacklistschema = mongoose.Schema({
    token:String
})

const blacklistModel = mongoose.model("blacklist",blacklistschema);

module.exports = {
    blacklistModel
}