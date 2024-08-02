const mongoose = require('mongoose');

let conn = null;

const uri = 'mongodb://localhost:27017/shelters';

module.exports = async function() {
    if (conn == null) {
      conn = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      }).then(() => mongoose);

      await conn;
    }

  return conn;
};
