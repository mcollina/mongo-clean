'use strict'

const urlModule = require('url')
const steed = require('steed')()
const MongoClient = require('mongodb').MongoClient

function clean (db, options, done) {
  var exclude = []
  if (arguments.length === 2) { // if only two arguments were supplied
    if (typeof options === 'function') {
      done = options
      options = {}
    }
  } else {
    if ('exclude' in options) {
      exclude = options.exclude
    }
  }
  var action = options.action || 'drop'
  steed.waterfall([
    clientify.bind(null, db),
    function (db, client, cb) {
      db.collections(function (err, collections) {
        if (err) {
          return cb(err)
        }

        // do not drop system collections
        collections = collections.filter(function (coll) {
          return (coll.collectionName.indexOf('system') !== 0 && exclude.indexOf(coll.collectionName) === -1)
        })

        cb(null, db, client, collections)
      })
    },
    function (db, client, collections, cb) {
      steed.each(collections, function (coll, sinCb) {
        coll[action](sinCb)
      }, function (err) {
        cb(err, db, client)
      })
    }
  ], done)
}

function clientify (db, cb) {
  if (typeof db === 'string') {
    const urlParsed = urlModule.parse(db)
    const databaseName = urlParsed.pathname ? urlParsed.pathname.substr(1) : null
    MongoClient.connect(db, { w: 1 }, (err, client) => {
      if (err) return cb(err, null)
      cb(null, client.db(databaseName), client)
    })
  } else {
    cb(null, db, null)
  }
}

module.exports = clean
