mongo-clean
===========

[![Build
Status](https://travis-ci.org/mcollina/mongo-clean.svg)](https://travis-ci.org/mcollina/mongo-clean)

Clean all the collections in a mongo database

## Install

```bash
npm install mongo-clean --save-dev
```

## Usage

Pass the database handler to `clean`.

```js
var clean = require('mongo-clean')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"

MongoClient.connect(url, { w: 1 }, function (err, client) {
  clean(client.db('mongocleantest'), function (err) {
    // your db is clean!
  })
})
```

Clean the db excluding a list of collections

```js
var clean = require('mongo-clean')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"

MongoClient.connect(url, { w: 1 }, function (err, client) {
  clean(client.db('mongocleantest'), {exclude: ['dummy1', 'dummy2']}, function (err) {
    // Delete all the collections in the db except dummy1 and dummy2
  })
})
```

Removing all elements instead of dropping the collections:

```js
var clean = require('mongo-clean')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"

MongoClient.connect(url, { w: 1 }, function (err, client) {
  clean(client.db('mongocleantest'), { action: 'remove' }, function (err) {
    // automatically removes all the data from all the collections in the db
  })
})
```

## License

MIT
