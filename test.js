'use strict'

var test = require('tape')
var clean = require('./')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/mongocleantest'

function getDB (cb) {
  MongoClient.connect(url, { w: 1 }, cb)
}

function close (db, t) {
  db.close(function () {
    t.end()
  })
}

function cleanVerifyAndClose (db, t) {
  clean(db, function (err, db) {
    t.notOk(err, 'no error')

    db.listCollections({}).toArray(function (err, collections) {
      t.notOk(err, 'no error')

      // there is only the system collection
      t.equal(collections.length, 1)

      close(db, t)
    })
  })
}

test('does nothing on an empty db', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    clean(db, function (err) {
      t.notOk(err, 'no error')
      close(db, t)
    })
  })
})

test('removes a collection', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    // creates collection dummy1
    db.createCollection('dummy1', function (err) {
      t.notOk(err, 'no error')

      // clean, verify and close
      cleanVerifyAndClose(db, t)
    })
  })
})

test('removes two collections', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    db.createCollection('dummy1', function (err) {
      t.notOk(err, 'no error')

      db.createCollection('dummy2', function (err) {
        t.notOk(err, 'no error')

        // clean, verify and close
        cleanVerifyAndClose(db, t)
      })
    })
  })
})

test('clean using an url', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    // creates collection dummy1
    db.createCollection('dummy3', function (err) {
      t.notOk(err, 'no error')

      db.close(function () {
        cleanVerifyAndClose(url, t)
      })
    })
  })
})

test('removes two collections on three', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    db.createCollection('dummy1', function (err) {
      t.notOk(err, 'no error')

      db.createCollection('dummy2', function (err) {
        t.notOk(err, 'no error')

        db.createCollection('dummy3', function (err) {
          t.notOk(err, 'no error')

          // clean, verify and close

          clean.exclude(db, ['dummy3'], function (err, db) {
            t.notOk(err, 'no error')

            db.listCollections({}).toArray(function (err, collections) {
              t.notOk(err, 'no error')

              // there are two collections, the system collection and dummy3
              t.equal(collections.length, 2)

              close(db, t)
            })
          })
        })
      })
    })
  })
})

test('removes two collections on four', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    db.createCollection('dummy1', function (err) {
      t.notOk(err, 'no error')

      db.createCollection('dummy2', function (err) {
        t.notOk(err, 'no error')

        db.createCollection('dummy3', function (err) {
          t.notOk(err, 'no error')

          db.createCollection('dummy4', function (err) {
            t.notOk(err, 'no error')

            // clean, verify and close

            clean.exclude(db, ['dummy1', 'dummy4'], function (err, db) {
              t.notOk(err, 'no error')

              db.listCollections({}).toArray(function (err, collections) {
                t.notOk(err, 'no error')

                // there are two collections, the system collection and dummy3
                t.equal(collections.length, 3)

                close(db, t)
              })
            })
          })
        })
      })
    })
  })
})
