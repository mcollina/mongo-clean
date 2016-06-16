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

Reusing the same client:

```js
var clean = require('mongo-clean')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/mongocleantest"

MongoClient.connect(url, { w: 1 }, function (err, db) {
  clean(db, function () {
    // your db is clean!
  })
})
```

Creating a new client:

```js
var clean = require('mongo-clean')
var url = "mongodb://localhost:27017/mongocleantest"

clean(url, function (err, db) {
  // automatically does MongoClient.connect for you
  // your db is clean!
})
```

Clean the db excluding a list of collections

```js
var clean = require('mongo-clean')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/mongocleantest"

MongoClient.connect(url, { w: 1 }, function (err, db) {
  clean(db, {exclude: ['dummy1', 'dummy2']}, function () {
    // Delete all the collections in the db except dummy1 and dummy2
  })
})
```

```js
var clean = require('mongo-clean')
var url = "mongodb://localhost:27017/mongocleantest"

clean(url, {exclude: ['dummy1', 'dummy2']}, function (err, db) {
  // automatically does MongoClient.connect for you
  // Delete all the collections in the db except dummy1 and dummy2
})
```

Removing all elements instead of dropping the collections:

```js
var clean = require('mongo-clean')
var url = "mongodb://localhost:27017/mongocleantest"

clean(url, { action: 'remove' }, function (err, db) {
  // automatically removes all the data from all the collections in the db
})
```

## License

MIT
