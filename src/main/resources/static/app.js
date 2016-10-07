var stompClient = null;
var username = null;
var last_sender = null;

function randomUsername() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for( var i=0; i < 5; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function connect() {
	var socket = new SockJS('/websocket-endpoint');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function (frame) {
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/messages', function (message) {
			showMessage(JSON.parse(message.body));
		});
	});
}

function send() {
	if( $("#content").val() == '' ) return;
	stompClient.send("/app/message", {}, JSON.stringify({
		'username': $("#username").val(),
		'content': $("#content").val()
	}));
}

function showMessage(message) {
	var hash = CryptoJS.MD5(message.username).toString();
	var img_data = new Identicon(hash, 50).toString();
	var colorHash = new ColorHash({
	      lightness: 0.5,
	      saturation: 0.7
	    });
    var color = colorHash.hex(message.username);
    var initial = message.username.charAt(0);
	    
	var message_class = ( $("#username").val() == message.username )? 'message-mine' : 'message-others';
	var sender_class = ( last_sender == message.username )? 'sender-hidden' : 'sender-show';
	$("#conversation")
	.append("<div class='message "+message_class+" "+sender_class+"'>" +
			//"<div class='photobox'><img class='photo' src='data:image/png;base64," + img_data + "'></div>" +
			"<div class='photobox'><div class='photo lavatar' style='background:" + color + "'>" + initial + "</div></div>" +
			"<div class='textbox'>" +
			"<div class='username'>"+message.username+"</div>" +
			"<div><span>" + message.content + "</span></div></div></div>");
	$("#conversation")[0].scrollTop = $("#conversation")[0].scrollHeight;
	last_sender = message.username;
}

$(function () {
	$("form").on('submit', function (e) {
		e.preventDefault();
	});
	connect();
	$( "#username" ).val( randomUsername() );
	$( "#send" ).click(function() { send(); });
});