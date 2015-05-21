// Run the unit tests
describe('Unit tests', function() {
  var tests = getTestsInDir('unit');
  tests.forEach(function(test) {
    importTest(test, test);
  });
});

// Example taken from: http://stackoverflow.com/questions/24153261/joining-tests-from-multiple-files-with-mocha-js
function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

function getTestsInDir(dir) {
  var tests = [],
      dirPath = require('path').join(__dirname, dir),
      pattern = /.*\.test\.js/;

  require('fs').readdirSync(dirPath).forEach(function(file) {
    if(file.match(pattern)) {
      tests.push('./' + dir + '/' + file);
    }
  });

  return tests;
}