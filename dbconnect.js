const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = 'mongodb://localhost:27017';

const connect = mongoose.connect(`${process.env.MONGODB_URI || url}/chat`, { useNewUrlParser: true });

module.exports = connect;
