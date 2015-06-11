var columnTypes = null;

function getColumnType(columnName, collection) {
  if(columnTypes == null) {
    buildColumnTypes(collection);
  }

  return columnTypes[columnName]; 
}

function buildColumnTypes(collection) {
  var field;
  columnTypes = {};
  
  for(fieldName in collection._attributes) {
    field = collection._attributes[fieldName];
    columnTypes[field.columnName] = field.type;
  }
}

module.exports = {
  solrNormalize: function(columnName, collection, value) {
    var columnType = getColumnType(columnName, collection);
    switch(columnType) {
      // Todo: check if the Z is actually needed
      case 'datetime':
        return value + 'Z';
        break;
      default:
        return value;
    }
  },
  
  // TODO: hasn't been tested or used
  sailsNormalize: function(fieldType, value) {
    var columnType = getColumnType(columnName, collection);
    
    switch(fieldType) {
      case 'datetime':
        // Remove the trailing Z from Solr datetime format
        return value.substring(0, value.length-1);
        break;
      default:
        return value;
    }
  }
}
