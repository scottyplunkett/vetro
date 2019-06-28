const mongoose = require('mongoose');
require('../models/Chat');

beforeEach(function(done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(
      `mongodb://localhost:27017/${process.env.TEST_SUITE}`, // <------- IMPORTANT
      function(err) {
        if (err) {
          throw err;
        }
        return clearDB();
      }
    );
  } else {
    return clearDB();
  }
});

afterEach(function(done) {
  mongoose.disconnect();
  return done();
});

afterAll(done => {
  return done();
});
