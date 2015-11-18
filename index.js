'use strict'

var async = require('async')
var MongoClient = require('mongodb').MongoClient

function clean (db, done) {
  cleanDb(db, null, done)
}

function cleanExclude (db, exclude, done) {
  cleanDb(db, exclude, done)
}

function cleanDb (db, exclude, done) {
  async.waterfall([
    clientify.bind(null, db),
    function (db, cb) {
      db.collections(function (err, collections) {
        if (err) {
          return cb(err)
        }

        // do not drop system collections
        collections = collections.filter(function (coll) {
          return coll.collectionName.indexOf('system') !== 0
        })

        cb(null, db, collections)
      })
    },
    function (db, collections, cb) {
      if (exclude === null) {
        cb(null, db, collections)
      } else {
        // do not drop excluded collections
        collections = collections.filter(function (coll) {
          return (exclude.indexOf(coll.collectionName) === -1)
        })

        cb(null, db, collections)
      }
    },
    function (db, collections, cb) {
      async.each(collections, function (coll, sinCb) {
        coll.drop(sinCb)
      }, function (err) {
        cb(err, db)
      })
    }
  ], done)
}

function clientify (db, cb) {
  if (typeof db === 'string') {
    MongoClient.connect(db, { w: 1 }, cb)
  } else {
    cb(null, db)
  }
}

module.exports = clean
module.exports.exclude = cleanExclude
