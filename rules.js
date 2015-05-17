module.exports.initGame = function(game) {
	game.objects["chatters"] = [];
}

module.exports.handleNewPlayer = function(game, player) {
	player.send({"type": "nameRequest"});
	addChatter(game, player);
}

updateChatters = function(game) {
	chatterList = [];
	game.objects["chatters"].forEach(function (p) {
		chatterList.push(p.name);
	});

	game.objects["chatters"].forEach(function (p) {
		p.send({"type":"userList","userList":chatterList});
	});
}

addChatter = function (game, player){
	player.send({"type":"welcome"});
	game.objects["chatters"].push(player);
	updateChatters(game);
}

module.exports.handleIncoming = function (game, message, player){
	if (message["type"]=="message"){
		game.objects["chatters"].forEach(function (p){
			p.send({"type":"message", "message":message.message, "author":player.name});
		});
		return;
	}
}
