var http = require('http')
var websocketServer = require('websocket').server;
var gameRules = require('./rules');

var Player = function (connection){
	this.connection = connection;
	this.name = null;
	this.params = {};
}

Player.prototype.send = function(data) {
	this.connection.sendUTF(JSON.stringify(data));
}

var Game = function () {
	this.players = [];
	this.objects = {}
	gameRules.initGame(this);
}

game = new Game();
httpServer = http.createServer(function (req,res){});
httpServer.listen(8765);
gameServer = new websocketServer({httpServer: httpServer});
gameServer.on('request', function(request){
	var connection = request.accept(null, request.origin);
	var player = new Player(connection);
	game.players.push(player);
	
	connection.on('message', function(message){
		var json = JSON.parse(message.utf8Data);
		console.log(player.name + " " + json["type"]);
		if(player.name==null && (json.type!="register" || game.players.map(function(x) { return x.name; }).indexOf(json.name)>=0)){
			player.send({"type":"nameRequest"});
		} else if(player.name==null && json.type=="register" && game.players.map(function(x) { return x.name; }).indexOf(json.name)<0){
			player.name = json.name;
			gameRules.handleNewPlayer(game, player);
		} else {
			gameRules.handleIncoming(game, json, player);
		}
		return;
	});

	//	connection.on('close', function(connection){
});
