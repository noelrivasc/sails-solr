module.exports = (function() {
  var solrFieldsHelper = {
    /**
     *
     * Map regular field names to their Solrized versions
     *
     * @param  {Object}     doc         [Solr document]
     * @param  {Object}     collection  [Sails model]
     * @return {}                       [none]
     */
    mapFieldNames: function(doc, collection) {
      for(var prop in collection.solrConfig.fieldMapping) {
        var sailsFieldName  = prop;
        var solrFieldName   = this.getSolrFieldName(sailsFieldName, collection);

        if(typeof(solrFieldName) != 'undefined') {
          doc[solrFieldName] = doc[sailsFieldName];
          delete doc[sailsFieldName];
        }
      }
    },

    /**
     *
     * Map a field name to their Solrized versions
     *
     * @param  {String}     fieldName   [field name]
     * @param  {Object}     collection  [Sails model]
     * @return {}                       [none]
     */
    getSolrFieldName: function(sailsFieldName, collection) {
      var solrFieldName   = collection.solrConfig.fieldMapping[sailsFieldName];

      return solrFieldName;
    },

    /**
     *
     * Map Solr field names back to the Sails names
     *
     * @param  {Object}     doc         [Solr document]
     * @param  {Object}     collection  [Sails model]
     * @return {}                       [none]
     */
    unmapFieldNames: function(doc, collection) {
      for(var prop in collection.solrConfig.fieldMapping) {
        var sailsFieldName  = prop;
        var solrFieldName   = this.getSolrFieldName(sailsFieldName, collection);

        if(typeof(solrFieldName) != 'undefined') {
          doc[sailsFieldName] = doc[solrFieldName];
          delete doc[solrFieldName];
        }
      }
    }
  };

  return solrFieldsHelper;
})();