![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# sails-solr

Provides easy access to `Apache Solr` from Sails.js & Waterline. This module is an attempt to simplify the usage or Solr as a NoSQL database while getting all the powerful search and indexing capabilities.

There is an [interesting presentation](http://www.slideshare.net/lucenerevolution/solr-cloud-the-search-first-nosql-database-extended-deep-dive) about NoSQL and search.

### Installation

To install this adapter, run:

```sh
$ npm install sails-solr
```

**Actually, not yet.** You'll have to clone this repository and link it with npm. We'll publish as a module as soon as we have decent documentation on getting started.

### Usage notes
Solr dynamic fields are supported without forcing the developer to use Solr-specific suffixes in their models: the suffix *_s* in name_s that would hint Solr to treat it as a string, for example. 

To accomplish this, Solr specific configuration is added to the Sails model configuration to determine how to map the model field names to the solr-specific ones.

This is an example of how field mapping is configured:

```javascript
module.exports = {
  autoPK: false, // This is important for Solr, since it doesn't use numeric IDs
  solrConfig: {
    fieldMapping: {
      name:       'name_s',         // for a String dynamic field *_s in your schema.xml
      itemCount:  'itemCount_i',    // for an Int dynamic field *_i 
      date:       'date_dt'         // for a DateTime dynamic field *_dt
    }
  },
  attributes: {
    name: {
      type: 'string',
    },
    itemCount: {
      type: 'integer',
    },
    name: {
      type: 'datetime',
    }
  }
}
```
### Usage

This adapter exposes the following methods:

###### `find()`

+ **Status**
  + In development

###### `create()`

+ **Status**
  + In development

###### `update()`

+ **Status**
  + In development

###### `destroy()`

+ **Status**
  + In development


### Interfaces

This adapter implements the semantic and queryable [interfaces](https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md).

The queryable interface is a work in progress and will take some time to mature but the basic filters and features of the *Waterline Query Language* are supported.

### Development

Check out **Connections** in the Sails docs, or see the `config/connections.js` file in a new Sails project for information on setting up adapters.


### License

**[MIT](./LICENSE)**
&copy; 2015 [Matrushka](http://www.matrushka.com.mx),
[Noel Rivas](http://www.nelovishk.com) & contributors

[Sails](http://sailsjs.org) is free and open-source under the [MIT License](http://sails.mit-license.org/).


