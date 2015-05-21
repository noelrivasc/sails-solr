var common        = require('../common');
var assert        = common.assert;
var expect        = common.expect;
var should        = common.should;

var queryBuilder  = require('../../lib/queryBuilder.js');

describe("queryBuilder", function() {
  describe("getCriteriaType()", function() {
    it('should return "match value" if the criteria is a string', function(done) {
      expect(queryBuilder.getCriteriaType('test string')).to.equal('match value');
      done();
    });

    
  });
});