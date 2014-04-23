
var async = require('async')

function clean(db, done) {
  db.collections(function(err, collections) {

    // do not drop system collections
    collections = collections.filter(function(coll) {
      return coll.collectionName.indexOf('system') !== 0
    })

    async.each(collections, function(coll, cb) {
      coll.drop(function(err) {
        cb(err);
      });
    }, done);
  })
}

module.exports = clean
