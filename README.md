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
Use the model *columnName* property for attributes to support Solr dynamic fields without having to use Solr-specific suffixes in your models.

This is an example of how to map model attributes to dynamic Solr fields

```javascript
module.exports = {
  attributes: {
    name: {
      type: 'string',
      columnName: 'name_s'  // If your Solr schema has a dynamic field with the pattern *_s, 
                            // this field will be treated as a string without having to add it
                            // to the schema as a named field
    },
    itemCount: {
      type: 'integer',
      columnName: 'itemCount_is' // You can also use multiple value fields
    },
  }
}
```
### Usage

This adapter exposes the following methods:

###### `find()`

+ **Status**
  + In development

Facets are supported in `find`. Just add a *facet* property to your find criteria:

```javascript
Model.find({
  facet: {
    field: 'somefield',
    pivot: 'somefield',
    mincount: 1
    ...
  }  
})
```

Facet properties supported by node-client are supported.

**Getting raw results**

If you need to get the raw Solr results for further processing (say, you want to get the pivot fields and do something with them instead of getting the docs), pass the *rawResponse* option in your search criteria.

```javascript
Model.find({
  rawResponse: true,
  facet: {
    field: 'somefield',
    pivot: 'somefield',
    mincount: 1
    ...
  }  
})
```

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


