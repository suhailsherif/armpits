module.exports.initGame = function (game) {
	game.objects.currentPlayer = Math.floor(Math.random()*2)
	game.objects.tableArray =
	[-1, -1, -1,
	-1, -1, -1,
	-1, -1, -1];
	game.objects["players"]=[];
}

module.exports.handleNewPlayer = function (game, player) {
	player.params.playerno = game.objects["players"].length;
	game.objects["players"].push(player);
	if (game.objects["players"].length == 2){
		startGame(game);
	} else {
		player.send({"type":"wait","info":"Waiting for another player"});
	}
}

startGame = function (game) {
	game.objects["players"].forEach(function (p) { p.send({"type":"gameStart"}); });
	askForMove(game);
}

askForMove = function (game) {
	game.objects["players"][game.objects.currentPlayer].send({"type":"move","table":game.objects.tableArray});
}

module.exports.handleIncoming = function (game, message, player) {
	if(player.params.playerno==game.objects.currentPlayer){
		if(game.objects.tableArray[message.position]==-1){
			game.objects.tableArray[message.position] = player.params.playerno;
			if(checkFinished(game)==-1){
				game.objects.currentPlayer = 1 - game.objects.currentPlayer;
				askForMove(game);
			}
		} else {
			player.send({"type":"invalidMove"});
			askForMove(game);
		}
	} else {
		player.send({"type":"wait","info":"Not your turn"});
	}
}

checkFinished = function (game) {
	var winningCombos = [   [0, 1, 2],   [3, 4, 5],   [6, 7, 8],
		         [0, 3, 6],   [1, 4, 7],   [2, 5, 8],
			    [0, 4, 8],   [2, 4, 6] ];
	var gameComplete = -1;
	for (var combo = 0; combo < winningCombos.length; combo++){
		var a = winningCombos[combo][0];
		var b = winningCombos[combo][1];
		var c = winningCombos[combo][2];
		if (game.objects.tableArray[a] == game.objects.tableArray[b]){
			if (game.objects.tableArray[b] == game.objects.tableArray[c]){
				if (game.objects.tableArray[a] != -1){
					gameComplete = game.objects.tableArray[a];
					finishGame(gameComplete);
				}
			}
		}
	}
	return gameComplete;
}

finishGame = function (winner) {
	game.objects["players"][winner].send({"type":"gameOver","result":"win"});
	game.objects["players"][1-winner].send({"type":"gameOver","result":"loss"});
}
