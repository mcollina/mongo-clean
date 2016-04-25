'use strict'

var test = require('tape')
var semver = require('semver')
var clean = require('./')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/mongocleantest'

var baseCount = !process.env.MONGODB_VERSION || semver.satisfies(process.env.MONGODB_VERSION, '>= 3.2.0') ? 0 : 1

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

      t.equal(collections.length, baseCount + 0)

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

          clean(db, {exclude: ['dummy1', 'dummy4']}, function (err, db) {
            t.notOk(err, 'no error')

            db.listCollections({}).toArray(function (err, collections) {
              t.notOk(err, 'no error')

              t.equal(collections.length, baseCount + 1)

              close(db, t)
            })
          })
        })
      })
    })
  })
})

test('removes two collections on four connecting via url', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    db.createCollection('dummy1', function (err) {
      t.notOk(err, 'no error')

      db.createCollection('dummy2', function (err) {
        t.notOk(err, 'no error')

        db.createCollection('dummy3', function (err) {
          t.notOk(err, 'no error')

          db.close(function () {
            clean(url, {exclude: ['dummy1', 'dummy2']}, function (err, db) {
              t.notOk(err, 'no error')

              db.listCollections({}).toArray(function (err, collections) {
                t.notOk(err, 'no error')

                t.equal(collections.length, baseCount + 2)

                close(db, t)
              })
            })
          })
        })
      })
    })
  })
})

test('removes all the content from a collection', function (t) {
  getDB(function (err, db) {
    t.notOk(err, 'no error')

    clean(db, function (err, db) {
      t.error(err)
      db.createCollection('aaa', function (err, coll) {
        t.error(err)
        coll.insert({ a: 42 }, function (err) {
          t.error(err)
          clean(db, { action: 'remove' }, function (err, db) {
            t.error(err)
            db.listCollections({}).toArray(function (err, collections) {
              t.error(err)
              t.equal(collections.length, baseCount + 1)
              coll.find().count(function (err, count) {
                t.error(err)
                t.equal(count, 0, 'no elements in the collection')
                close(db, t)
              })
            })
          })
        })
      })
    })
  })
})
