
var test        = require('tap').test
  , clean       = require('./')
  , MongoClient = require('mongodb').MongoClient
  , url         = "mongodb://localhost:27017/mongocleantest"

function getDB(cb) {
  MongoClient.connect(url, { w: 1 }, cb);
}

function close(db, t) {
  db.close(function() {
    t.end()
  })
}

function cleanVerifyAndClose(db, t) {
  clean(db, function(err, db) {
    db.collectionNames(function(err, collections) {
      t.notOk(err, 'no error')

      // there is only the system collection
      t.equal(collections.length, 1)

      close(db, t)
    });
  })
}

test('does nothing on an empty db', function(t) {
  getDB(function(err, db) {
    clean(db, function(err) {
      console.log(err);
      t.notOk(err, 'no error')
      close(db, t)
    })
  })
})

test('removes a collection', function(t) {
  getDB(function(err, db) {
    // creates collection dummy1
    db.createCollection("dummy1", function(err) {
      // clean, verify and close
      cleanVerifyAndClose(db, t);
    })
  })
})

test('removes two collections', function(t) {
  getDB(function(err, db) {
    db.createCollection("dummy1", function(err) {
      db.createCollection("dummy2", function(err) {
        // clean, verify and close
        cleanVerifyAndClose(db, t);
      })
    })
  })
})

test('clean using an url', function(t) {
  getDB(function(err, db) {
    // creates collection dummy1
    db.createCollection("dummy3", function(err) {
      db.close(function() {
        cleanVerifyAndClose(url, t)
      })
    })
  })
})
