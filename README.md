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
var clean       = require('./')
  , MongoClient = require('mongodb').MongoClient
  , url         = "mongodb://localhost:27017/mongocleantest"

MongoClient.connect(url, { w: 1 }, function(err, db) {
  clean(db, function() {
    // your db is clean!
  })
});
```

Creating a new client:

```js
var clean       = require('./')
  , url         = "mongodb://localhost:27017/mongocleantest"

clean(url, function(err, db) {
  // automatically does MongoClient.connect for you
  // your db is clean!
})
```

## License

MIT
