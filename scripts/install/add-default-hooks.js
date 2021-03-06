var hooks = require('microservice-examples');

var config = require('../../config');

var hookM = require('../../lib/resources/hook');

var colors = require('colors');


hookM.persist(config.couch);

var services = Object.keys(hooks.services);
services = services.reverse();
//services = [services[0]]

function addHook () {

  if (services.length === 0) {
    console.log('done'.magenta);
    process.exit();
  }

  var h = services.pop();
  var hook = hooks.services[h];
  // add a new hook to the database
  // console.log(hook.schema);

  if (typeof hook.view !== "undefined" && hook.view.length > 0) {
    hook.themeStatus = "enabled";
  } else {
    hook.themeStatus = "disabled";
  }

  var newHook = {
    name: h,
    owner: "examples",
    language: hook.language,
    description: hook.description,
    source: hook.source,
    mschema: hook.schema,
    themeSource: hook.view,
    presenterSource: hook.presenter,
    themeStatus: hook.themeStatus,
    sourceType: "code",
    pkg: hook.pkg
  };

  hookM.find({ owner: "examples", name: h }, function (err, results) {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      console.log('creating'.red, newHook)
      hookM.create(newHook, function(err, res){
        if(err) {
          throw err;
        }
        console.log('created'.green, newHook.name);
        // iterate
        addHook();
      });
    } else {
      var _h = results[0];
      _h.source = newHook.source;
      _h.description = newHook.description;
      _h.language = newHook.language;
      _h.hookType = newHook.hookType;
      _h.sourceType = newHook.sourceType;
      _h.themeSource = newHook.themeSource;
      _h.presenterSource = newHook.presenterSource;
      _h.mschema = newHook.mschema;
      _h.pkg = newHook.pkg;
      _h.themeStatus = newHook.themeStatus;

      if (typeof hook.view !== "undefined" && hook.view.length > 0) {
        hook.themeStatus = "enabled";
      } else {
        hook.themeStatus = "disabled";
      }
      _h.save(function(){
        if(err) {
          throw err;
        }
        console.log('updated'.blue, newHook.name);
        addHook();
      });
    }
  });

}

addHook();