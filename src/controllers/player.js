module.exports = function(swagger,services){
    return new PlayerResource(swagger,services);
};

function PlayerResource(swagger,services){
    this.services = services;
    this.swagger = swagger;
}

PlayerResource.prototype.findById = function(){
    var self = this;
    return {
        'spec': {
            description : "Operations about players",
            path : "/players/{playerId}",
            notes : "Returns a player based on ID",
            summary : "Find player by ID",
            method: "GET",
            parameters : [self.swagger.pathParam("playerId", "Player Id needed to be fetched", "integer")],
            type : "Sensor",
            produces : ["application/json"],
            responseMessages : [self.swagger.errors.invalid('id'), self.swagger.errors.notFound('player')],
            nickname : "getPlayertById"
        },
        'action': function (req,res) {
            if (!req.params.playerId) {
                throw self.swagger.errors.invalid('id');
            }
            res.send(201);
        }
    }
};

PlayerResource.prototype.create = function(){
    var self = this;
    return {
        'spec': {
            description : "Operations about Players",
            path : "/players/",
            notes : "Create a Player Entity",
            summary : "create a player",
            method: "POST",
            parameters : [self.swagger.bodyParam("Player", "Player Object", "Player")],
            consumes : ["application/json"],
            produces : ["application/json"],
            responseMessages : [self.swagger.errors.invalid('Body')],
            nickname : "createPlayer"
        },
        'action': function (req,res) {
            if (!req.body) {
                throw self.swagger.errors.invalid('body');
            }
            self.swagger.stopWithError(res, {code: 500, message: "Not Implemented!"});
        }
    }
};