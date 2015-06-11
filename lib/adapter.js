/**
 * Module Dependencies
 */
// ...
// e.g.
// var _ = require('lodash');
// var mysql = require('node-mysql');
// ...


var solr              = require('solr-client');
var QueryBuilder      = require('./queryBuilder');
var AutoId            = require('./autoId');
var SolrError         = require('./solrErrors');

// Todo: remove or rewrite to autoconfigure model for dynamic fields.
// var SolrFieldsHelper  = require('./solrFieldsHelper');

/**
 * waterline-sails-solr
 *
 * Most of the methods below are optional.
 *
 * If you don't need / can't get to every method, just implement
 * what you have time for.  The other methods will only fail if
 * you try to call them!
 *
 * For many adapters, this file is all you need.  For very complex adapters, you may need more flexiblity.
 * In any case, it's probably a good idea to start with one file and refactor only if necessary.
 * If you do go that route, it's conventional in Node to create a `./lib` directory for your private submodules
 * and load them at the top of the file with other dependencies.  e.g. var update = `require('./lib/update')`;
 */
module.exports = (function () {
  var connections = {};

  var adapter = {
    // Default configuration for connections
    defaults: {
			"host": "127.0.0.1",
      "port": 8983,
      "path": "/solr",
      "core": "sailsTests",
      "autoId": true        // This is true by default to have the adapter
                            // pass the waterline tests that send documents 
                            // without an id field.
    },

    /**
     *
     * This method runs when a model is initially registered
     * at server-start-time.  This is the only required method.
     *
     * @param  {[type]}   connection [description]
     * @param  {[type]}   collection [description]
     * @param  {Function} cb         [description]
     * @return {[type]}              [description]
     */
    registerConnection: function(connectionSettings, collections, cb) {
      if(!connectionSettings.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connectionSettings.identity]) return cb(new Error('Connection is already registered.'));

      connections[connectionSettings.identity]                = solr.createClient(connectionSettings);
      connections[connectionSettings.identity].sailsSettings  = connectionSettings;
      connections[connectionSettings.identity].collections    = collections;
      cb();
    },


    /**
     * Fired when a model is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    // Teardown a Connection
    teardown: function (conn, cb) {

      if (typeof conn == 'function') {
        cb = conn;
        conn = null;
      }
      if (!conn) {
        connections = {};
        return cb();
      }
      if(!connections[conn]) return cb();
      delete connections[conn];
      cb();
    },

    // Return attributes
    describe: function (connection, collection, cb) {
			// Add in logic here to describe a collection (e.g. DESCRIBE TABLE logic)
      return cb();
    },

    /**
     *
     * REQUIRED method if users expect to call Model.find(), Model.findOne(),
     * or related.
     *
     */
    find: function (connectionName, collectionName, options, cb) {
      var client      = connections[connectionName];
      var collection  = client.collections[collectionName];
      var query   = client.createQuery();
      
      QueryBuilder.buildFiltersFromWaterlineOptions(options, query, collection);

      client.search(query, function(err, obj) {
        if(err) {
          return cb(err);
        }
        else {
          obj.response.docs.forEach(function(doc) {
            //TODO: remove field mapping. Done in model configuration
            //SolrFieldsHelper.unmapFieldNames(doc, collection);
          });

          return cb(null, obj.response.docs);
        }
      });
    },
    drop: function() {
    },
    initialize: function(cb) {
      cb();
    },
    create: function (connectionName, collectionName, values, cb) {
      var client      = connections[connectionName];
      var collection  = client.collections[collectionName];
      var docs        = JSON.parse(JSON.stringify(values));

      // If a single doc object was received, wrap it with an array
      // to always deal with the values in the same way
      if(typeof(docs) == 'object') {
        docs = [docs];
      }

      // the solrDocs are going to be modified for Solr storage
      // by mapping the field names, but we don't want to return
      // them to Sails, so we clone them just for Solr.
      var solrDocs    = JSON.parse(JSON.stringify(docs));

      solrDocs.forEach(function(doc) {
        if(typeof(doc.id) == 'undefined' && client.sailsSettings.autoId) {
          console.warn(SolrError.MissingId);
          doc.id = AutoId.getDefault(doc);
        }

        //TODO: remove field mapping. Done in model configuration
        //SolrFieldsHelper.mapFieldNames(doc, collection);
      })

      client.add(solrDocs, function(err, obj) {
        if(err) {
          cb(err);
        }
        else {
          client.commit(function(err, obj) {
            if(err) {
              cb(err);
            }
            else {
              var response = (typeof(values) == 'object') ? docs[0] : docs;
              cb(null, response);
            }
          });
        }
      });
    },

    update: function (connectionName, collectionName, options, values, cb) {
      var adapter           = this;
      var client            = connections[connectionName];
      var collectionObject  = client.collections[collectionName];
      var doc               = JSON.parse(JSON.stringify(values));

      // TODO: dynamic fields and timestamps
      doc.updatedAt_dt = doc.updatedAt;
      delete doc.updatedAt;
      
      // Find the IDs that match the options
      options.select  = 'id';

      collectionObject.find(options)
        .exec(function(err, found) {
          if(err) {
            cb(err);
          }
          else {
            var docs  = adapter.getUpdateDocuments(doc, found);

            client.add(docs, function(err, obj) {
              if(err) {
                cb(err);
              }
              else {
                client.commit(function(err, obj) {
                  if(err) {
                    cb(err);
                  }
                  else {
                    cb(null, obj);
                  }
                });
              }
            });
          }
        })
    },

    /**
     * Builds a JSON string with multiple documents to be updated in Solr
     *
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    getUpdateDocuments: function(updateFields, ids) {
      var docs = [];
      ids.forEach(function(value) {
        var doc = {};

        for(prop in updateFields) {
          doc[prop] = {'set': updateFields[prop]}
        }

        doc.id = value.id;

        docs.push(doc);
      })

      return docs;
    },

    destroy: function (connectionName, collectionName, options, cb) {
      var adapter     = this;
      var client      = connections[connectionName];
      var query       = client.createQuery();
      var queryString = QueryBuilder.buildSimpleQueryFromWaterlineOptions(options, query, 'or');

      client.deleteByQuery(queryString, function(err, obj) {
        if(err) {
          err.query = query;
          cb(err);
        }
        else {
          client.commit(function(err, obj) {
            if(err) {
              cb(err);
            }
            else {
              cb(null, obj);
            }
          });
        }
      });
    }

    /*

    // Custom methods defined here will be available on all models
    // which are hooked up to this adapter:
    //
    // e.g.:
    //
    foo: function (collectionName, options, cb) {
      return cb(null,"ok");
    },
    bar: function (collectionName, options, cb) {
      if (!options.jello) return cb("Failure!");
      else return cb();
      destroy: function (connection, collection, options, values, cb) {
       return cb();
     }

    // So if you have three models:
    // Tiger, Sparrow, and User
    // 2 of which (Tiger and Sparrow) implement this custom adapter,
    // then you'll be able to access:
    //
    // Tiger.foo(...)
    // Tiger.bar(...)
    // Sparrow.foo(...)
    // Sparrow.bar(...)


    // Example success usage:
    //
    // (notice how the first argument goes away:)
    Tiger.foo({}, function (err, result) {
      if (err) return console.error(err);
      else console.log(result);

      // outputs: ok
    });

    // Example error usage:
    //
    // (notice how the first argument goes away:)
    Sparrow.bar({test: 'yes'}, function (err, result){
      if (err) console.error(err);
      else console.log(result);

      // outputs: Failure!
    })




    */




  };


  // Expose adapter definition
  return adapter;

})();

