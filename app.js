/**
 * Module dependencies.
 */
var express = require('express'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    basicAuth = require('basic-auth-connect'),
    path = require('path'),
    content = require('./package.json');
    Contentstack = require('contentstack');

var app = express();
app.disable('x-powered-by');
//app.use(function (req, res, next) {
//  res.removeHeader("x-powered-by");
//  next();
//});
var env = process.env.NODE_ENV || "dev",
    _dirname = (process.env.SITE_PATH) ? path.resolve(process.env.SITE_PATH) : process.cwd(),
    _env;
try {
  // load environment based configurations
  var _path = path.join(_dirname, 'config');
  if(env === 'dev')
    _env = require(path.join(_path, 'default'));
  else
    _env = require(path.join(_path, env));

  // load globals
  global['config'] = _env;
  var stack = Contentstack.Stack({
    api_key: config.contentstack.api_key ,
    access_token: config.contentstack.access_token,
    environment: config.contentstack.environment
  });
  stack.setHost('dev1-new-api.contentstack.io');
global['Stack'] = stack;
  // load port
  var PORT = process.env.PORT || 5000;

  // Client side pages to fall under ~/views directory
  app.set('views', path.join(__dirname, 'views'));

  // Setting Nunjucks as default view
  nunjucks.configure('views', {
    autoescape: false,
    express   : app
  });
  app.set('view engine', 'html');
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(basicAuth('built', 'built123'));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  console.log("Environment:",env)
  //to get css and javascript version for cloudfront
  app.locals.getVersion = function () {
    return content.version;
  };

  //Get Environment Name For console section
  app.locals.getEnvName = function () {
    return env;
  };
  //add /docs
  app.locals.getURL = function (url) {
    if(env == "staging" || env == "production"){
      url = "/docs"+url;
    }
    return url;
  };

  // Routes
  require('./routes')(app);

  app.listen(PORT, function() {
    console.log('Start your browser to http://localhost:' + PORT);
  });

} catch (error) {
  console.error('Did not find configuration for the specified environment');
  console.error(error);
  console.error('exiting!');
}

module.exports = app;

