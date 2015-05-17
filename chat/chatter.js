// var connection=false;
// var crosswordCells=false;
// var crossword=false;
// var currentClue=false;
// var players = {};

$(function () {
    // if user is running mozilla then use its built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket('ws://10.228.152.150:8765');

    console.log(connection);
    
    connection.onopen = function () {
        //$('#status').html("Enter your name to join or wait for the chat to start to spectate.");
		//$('#statusline2').html("<form action=\"javascript:register()\"><input type=\"text\" id=\"registername\"/><input type=\"button\" onclick=\"register()\" value=\"Register!\" /></form>")
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like valid JSON: ', message.data);
            return;
        }
		console.log(message);
        
        if (json.type == "userList")	updateUserList(json);	//new user

        if (json.type == "message")		addMessage(json); 		//receive message

    };
});

function register () {
	connection.send(JSON.stringify({"type":"register","name":$('#registerer').val()}));
	$('#registration').remove();
	$('#messager').removeAttr("disabled");
	//return false;
}

// function addUser (newUser) {
// 	$(newUser.name).appendTo$('#users');
// }

function updateUserList (json) {
	$('#users').html("");
	console.log(json.userList);
	for (var user in json.userList){
		//$('#users').html() += "U: " + (json.userList[user]) + "<br />";
		var us = json.userList[user];
		$("<b> " + us + "<br />").appendTo('#users');
	}
}

function addMessage (json) {
	//console.log("recvd");
	$("<p>" + json.message + "<br /> --- " + json.author + "</p>").appendTo('#chats');
}

function sendMessage () {
	//var mess = JSON.stringify({"type": "message", "author" : "ah", "message": $('#messager').val()})
	var mess = JSON.stringify({"type": "message", "message": $('#messager').val()})
	connection.send(mess);
	//console.log(mess)
	$('#messager').val("");
	//clearGuess();
}