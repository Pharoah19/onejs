var assert            = require('assert'),
    one               = require('../lib'),
    common            = require('./common'),
    assertListContent = common.assertListContent;

exports.init = function init(options, callback){
  if(options.target){
    callback(undefined, require(options.target));
    return;
  }

  common.build('test/packages/sai', undefined, [], function(exitCode){
    callback(undefined, require('../tmp/sai'));
  });
}

exports.testExcluding = function(sai, done){
  assert.deepEqual(['monouchi', 'sai', 'main'], Object.keys(sai.packages));
  done();
};

exports.testTies = function(sai, done){
  assert.equal(Math.PI, sai.require('pi'));
  assert.equal(Number.MAX_VALUE, sai.require('max'));
  done();
};

exports.testAlias = function(sai, done){
  assert.ok(sai.require('monouchi-alias').monouchi);
  done();
};

exports.testSplitting = function(sai, done){
  assert.ok(require('fs').existsSync('tmp/tsume.js'));
  done();
};

exports.testName = function(sai, done){
  var fs = require('fs');

  assert.equal(fs.readFileSync('./tmp/sai.js').toString().slice(0, 9), 'var s_a_i');

  done();
}