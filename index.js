
var async       = require('async')
  , MongoClient = require('mongodb').MongoClient

function clean(db, done) {
  async.waterfall([
    clientify.bind(null, db),
    function(db, cb) {
      db.collections(function(err, collections) {

        // do not drop system collections
        collections = collections.filter(function(coll) {
          return coll.collectionName.indexOf('system') !== 0
        })

        cb(null, db, collections)
      })
    },
    function(db, collections, cb) {
      async.each(collections, function(coll, sinCb) {
        coll.drop(sinCb)
      }, function(err) {
        cb(err, db)
      })
    }
  ], done);
}


function clientify(db, cb) {
  if (typeof db === 'string') {
    MongoClient.connect(db, { w: 1 }, cb)
  } else {
    cb(null, db)
  }
}

module.exports = clean
