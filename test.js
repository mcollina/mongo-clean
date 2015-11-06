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
