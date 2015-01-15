var express = require("express")
    , url = require("url")
    , cors = require("cors")
    , bodyParser = require('body-parser')
    , app = express()
    , swagger = require("swagger-node-express")
    , port = 8002;


var services = require('./src/services');
var playerResources = require("./src/controllers/player.js")(swagger,services);


var corsOptions = {
    credentials: true,
    origin: function(origin,callback) {
        if(origin===undefined) {
            callback(null,false);
        } else {
            // change wordnik.com to your allowed domain.
            var match = origin.match("^(.*)?.wordnik.com(\:[0-9]+)?");
            var allowed = (match!==null && match.length > 0);
            callback(null,allowed);
        }
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors(corsOptions));

swagger.setAppHandler(app);


swagger.addValidator(
    function validate(req, path, httpMethod) {
        //  example, only allow POST for api_key="special-key"
        if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
            var apiKey = req.headers["api_key"];
            if (!apiKey) {
                apiKey = url.parse(req.url,true).query["api_key"]; }
            if ("special-key" == apiKey) {
                return true;
            }
            return false;
        }
        return true;
    }
);

var models = require("./src/domain/models.js");

// Add models and methods to swagger
swagger.addModels(models)
    .addGet(playerResources.findById())
    .addPost(playerResources.create());

// set api info
swagger.setApiInfo({
    title: "Player Interface API",
    description: "NodeJs application to expose player entity",
    termsOfServiceUrl: "http://tarborda.globallogic.com/terms/",
    contact: "diego.ramirez@globallogic.com",
    license: "Apache XXX",
    licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
    apiKey: {
        type: "apiKey",
        passAs: "header"
    }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://localhost:8002", "0.1.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + "/node_modules/swagger-node-express/swagger-ui/");
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
        res.writeHead(302, { 'Location' : req.url + '/' });
        res.end();
        return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);
});

app.get('/throw/some/error', function(){
    throw {
        status: 500,
        message: 'we just threw an error for a test case!'
    };
});

app.use(function(err, req, res, next){
    res.send(err.status, err.message);
});


console.log('Starting server on port: ' + port);
app.listen(port);
