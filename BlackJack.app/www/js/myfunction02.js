/**
 * 2Player画面用の処理
 * Socket.IOバージョン1.0だと再接続時に不具合がある
 */

var socket;
function socket_connect() {
	// Socket.IO Serverへ接続確認
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "http://192.168.0.22:3000", false);
	try{
		xmlHttp.send(null);
	} catch(e) {
		document.getElementById('result02').style.display = 'block';
		document.getElementById('result02').innerText = 'WebSocketサーバの接続に失敗しました。';
	}
	
	if (typeof socket === "undefined"){
		socket = io.connect("http://192.168.0.22:3000", {
			'reconnect': true,  // 再接続を有効
			'reconnection delay': 500,
			'max reconnection attempts': 10
		});
	} else {
		socket.socket.connect();
	}
	
	// サーバーからメッセージを受け取った時のイベント
	socket.on("message", function(message){
		document.getElementById('server-message').innerText = message.value;
		document.getElementById('server-counter').innerText = message.counter;
		if (message.counter < 2) {
			document.getElementById('result02').style.display = 'block';
			document.getElementById('result02').innerText = '対戦相手が現れるまでお待ち下さい。';
			document.getElementById('btn-0201').disabled = 'disabled';
		} else {
			document.getElementById('result02').innerText = '';
			document.getElementById('btn-0201').disabled = '';
		}
	});
	
	socket.on("message_gamestart", function(message){
		document.getElementById('cards').innerText = message.cards;
		// oneself と opponent を逆に表示する
		document.getElementById('opponent-cards').innerText = message.oneself;
		document.getElementById('oneself-cards').innerText = message.opponent;
		document.getElementById('atack').innerText = message.atack;
		// canvasのカードを一旦削除する
		erase_card('oneself-canv');
		erase_card('opponent-canv');
		
		// htmlタグのカードをcanvasへ表示する
		display_card_common00('oneself', 2000);
		display_card_common00('opponent', 1000);
		
		// ボタンの表示・非表示
		var elems = document.getElementsByClassName('init-hidden');
		for (var i = 0; i< elems.length; i++){
			elems[i].style.display = 'block';
		}
		
		document.getElementById('btn-0201').style.display = 'none';
		document.getElementById('btn-0203').style.display = 'none';
		document.getElementById('btn-0204').style.display = 'none';
		document.getElementById('result02').innerText = '';
		document.getElementById('result02').innerText = '対戦相手の手番です。しばらくお待ち下さい。';
		document.getElementById('transition').innerText = '';
	});
	
	socket.on("message_gameend", function(message){
		// 画面の表示・非表示
		var elems = document.getElementsByClassName('init-hidden');
		for (var i = 0; i < elems.length; i++){
			elems[i].style.display = 'none';
		}
		document.getElementById('btn-0201').style.display = 'block';
	});
	
	socket.on("message_requestcard", function(message){
		document.getElementById('cards').innerText = message.cards;
		// oneself と opponent を逆に表示する
		document.getElementById('opponent-cards').innerText = message.oneself;
		// htmlタグのカードをcanvasへ表示する
		var arrayCards=[];
		arrayCards = document.getElementById('opponent-cards').innerHTML.split(',');
		var x=0, y=0, width=60, height=90, delay=0;
		for (var i = 0; i < arrayCards.length; i++){
			display_card_common02('opponent', arrayCards[i], x, y, width, height, delay, 'start');
			x = x + 70;
			delay = delay + 0;
		}
	});
	
	socket.on("message_notrequestcard", function(message){
		document.getElementById('transition').innerText = message.transition;
		if(message.transition == 3){
			// ボタンの表示・非表示
			document.getElementById('btn-0203').style.display = 'block';
			document.getElementById('btn-0204').style.display = 'block';
			document.getElementById('result02').innerText = '';
		} else if(message.transition == 4){
			document.getElementById('btn-0201').style.display = 'block';
			document.getElementById('btn-0203').style.display = 'none';
			document.getElementById('btn-0204').style.display = 'none';
			document.getElementById('result02').style.display = 'block';
			document.getElementById('result02').innerHTML = '対戦相手の点数：' + display_score('opponent') + '<br>あなたの点数：' + display_score('oneself') + '<br>' + get_result(display_score('opponent'), display_score('oneself'));
			
			// 対戦相手のカードを表にする。
			display_card_common01('opponent');
		}
	});
	
	// 接続時のイベント
	socket.on("connect", function() {
		console.log("client: connect");
	});
	
	// サーバーから誰かが接続解除したメッセージを受け取った時のイベント
	socket.on("disconnect", function(client) {
		console.log(client.sessionId + " disconnected.");
	});
}

// ボタンをクリックした時の処理
function btn_0201(){ // GAME START

	//socket_connect();
	
	document.getElementById('cards').innerText = 's01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13,h01,h02,h03,h04,h05,h06,h07,h08,h09,h10,h11,h12,h13,c01,c02,c03,c04,c05,c06,c07,c08,c09,c10,c11,c12,c13,d01,d02,d03,d04,d05,d06,d07,d08,d09,d10,d11,d12,d13';

  // Playerのカードを表示
	var strCard='', arrayCards=[];
 	for (var i = 0; i < 2; i++ ){
		arrayCards.push(get_random());
	}
	// 配列をhtml要素に入れる
	document.getElementById('oneself-cards').innerText = arrayCards;
	
  // Playerのカードを表示
	var strCard='', arrayCards=[];
  for (var i = 0; i < 2; i++ ){
		arrayCards.push(get_random());
	}
	// 配列をhtml要素に入れる
	document.getElementById('opponent-cards').innerText = arrayCards;
	
	// サーバにメッセージを送信する
	socket.emit('message_gamestart',{
		cards : document.getElementById('cards').innerText,
		// サーバでtransitionをカウントアップする,
		oneself : document.getElementById('oneself-cards').innerText,
		opponent : document.getElementById('opponent-cards').innerText,
		atack : 2
	});
	
	// ローカルのhtmlタグへ表示する
	document.getElementById('atack').innerText = 1;
	
	// canvasのカードを一旦削除する
	erase_card('oneself-canv');
	erase_card('opponent-canv');

	// htmlタグのカードをcanvasへ表示する
	display_card_common00('oneself', 1000);
	display_card_common00('opponent', 2000);

	// ボタンの表示・非表示
	var elems = document.getElementsByClassName('init-hidden');
	for (var i = 0; i< elems.length; i++){
			elems[i].style.display = 'block';
	}
	document.getElementById('btn-0201').style.display = 'none';
	document.getElementById('result02').innerText = '';
	document.getElementById('transition').innerText = '';
	// ボタンを一定時間非活性
	document.getElementById('btn-0203').disabled = 'disabled';
	document.getElementById('btn-0204').disabled = 'disabled';
	setTimeout(function(){
		document.getElementById('btn-0203').disabled = '';
		document.getElementById('btn-0204').disabled = '';
	}, 4000);
}

function btn_0202(){ // GAME END
	// SocketServerに接続している場合の処理
	if(typeof socket === "undefined"){
		//
	} else {
		socket.emit('message_gameend', {
		});
		// iOSからemitできていないため切断を遅延させる
		setTimeout(function(){
			socket.disconnect();
		}, 1000);
	}
	
	// 画面の表示・非表示
	var elems = document.getElementsByClassName('init-hidden');
	for (var i = 0; i < elems.length; i++){
		elems[i].style.display = 'none';
	}
	document.getElementById('btn-0201').style.display = 'block';
	history.back();
}

function btn_0203(){ // REQUEST A CARD
	// html要素からカードを取得
	var arrayCards = document.getElementById('oneself-cards').innerHTML.split(',');
	arrayCards.push(get_random());
	// html要素に入れる
	document.getElementById('oneself-cards').innerText = arrayCards;
	// カード表示
	display_card_common01('oneself');
	
	socket.emit('message_requestcard', {
		cards : document.getElementById('cards').innerText,
		oneself : document.getElementById('oneself-cards').innerText
	});
	//  表示枚数制限（上限値を超えたら強制的にSTANDする）
	var cards = document.getElementById('oneself-cards').innerHTML.split(',');
	if (cards.length >= 4){
		btn_0204();
	}
}

function btn_0204(){ // NOT REQUEST CARD
  socket.emit('message_notrequestcard', {
		// nodeサーバでtranstionをカウントアップする
	});
	if(document.getElementById('transition').innerText < 3){
		// ボタンの表示非表示
		document.getElementById('btn-0203').style.display = 'none';
		document.getElementById('btn-0204').style.display = 'none';
		document.getElementById('result02').innerText = '対戦相手の手番です。しばらくお待ち下さい。';
	} else {
		document.getElementById('btn-0201').style.display = 'block';
		document.getElementById('btn-0203').style.display = 'none';
		document.getElementById('btn-0204').style.display = 'none';
		document.getElementById('result02').innerHTML = '対戦相手の点数：' + display_score('opponent') + '<br>あなたの点数：' + display_score('oneself') + '<br>' + get_result(display_score('opponent'), display_score('oneself'));
		
		// 対戦相手のカードを表にする。
		display_card_common01('opponent');
	}
}
