var debug   = require("./debug")('relatives-of'),
    uniques = require('uniques'),
    path    = require('path'),
    newModule;

module.exports = relativesOf;

function createModule(relative, filename){
  newModule || ( newModule = require('./module') );

  return newModule(filename, relative.pack);
}

function filenameOf(module){
  return module.filename;
}

function flatten(modules){
  var result, i;

  result = modules.slice();
  i      = modules.length;
  while( i --> 0 ){
    result.push.apply(result, modules[i].relatives);
  }

  result = uniques(result);

  result.toString = function(){
    return result.map(nameOf).join(', ');
  };

  return result;
}

function isNotNil(o){
  return !!o;
}

function isRelative(uri){
  return /^\./.test(uri);
}

function nameOf(module){
  return module.name;
}

function relativesOf(module){
  debug('Loading relatives of %s', module);

  var relativeRequires = module.requires.filter(isRelative),
      modules          = relativeRequires.map(abs).map(createModule.bind(undefined, module));

  relativeRequires.forEach(function(uri, ind){
    if( ! modules[ind] ) return;

    module.map[uri] = modules[ind];
  });

  return flatten(modules.filter(isNotNil));

  function abs(filename){
    return path.join(path.dirname(module.filename), filename) + ( /\.js$/.test(filename) ? '' : '.js' );
  }
}