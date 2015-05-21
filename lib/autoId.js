var md4 = require('js-md4');

module.exports = (function() {
	var autoId = {
		getDefault: function(doc) {
			return this.getDocumentHash(doc);
		},
		getDocumentHash: function(doc) {
			return (md4(JSON.stringify(doc)));
		}
	};

	return autoId;
})();