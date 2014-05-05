/**
 * 共通Javascriptファイル
 */

// ゲームスタート時にhtml要素に入っているカードをcanvasにカードを表示する。
function display_card_common00(player, delay){
	var x=0, y=0, width=60, height=90;
	var arrayCards = document.getElementById(player + '-cards').innerHTML.split(',');
	for (var i = 0; i < arrayCards.length; i++){
		display_card_common02(player, arrayCards[i], x, y, width, height, delay);
				x += 70;
		delay += 2000;
	}
}
// カード要求時にhtml要素に入っているカードをcanvasにカードを表示する。
function display_card_common01(player){
	var x=0, y=0, width=60, height=90, delay=0;
	var arrayCards = document.getElementById(player + '-cards').innerHTML.split(',');
	for (var i = 0; i < arrayCards.length; i++){
		display_card_common02(player, arrayCards[i], x, y, width, height, delay);
				x += 70;
	}
}
// canvas表示共通部分
function display_card_common02(player, card, x, y, width, height, delay){
	setTimeout(function(){
		var img = new Image();
		var canvas = document.getElementById(player + '-canv');
		var ctx = canvas.getContext("2d");
		img.src = "png/" + card + ".png";
		img.onload = function(){
			ctx.drawImage(img, x, y, width, height);
		}
	}, delay);
}

// 点数表示
function display_score(player){
	var cards = document.getElementById(player + '-cards').innerHTML.split(',');
	var score = 0;
	for (var i = 0; i < cards.length; i++){
		if (parseInt(cards[i].match(/\d+/)) > 10){
			score += 10;
		} else {
			score += parseInt(cards[i].match(/\d+/));
		}
	}
	return score;
}

// 勝敗を判定する。
function get_result(computer_score, player_score) {
  if (player_score > 21) {
    return "あなたの負けです。21を超えました。";
  } else if (computer_score > 21 || computer_score < player_score) {
    return "あなたの勝ちです。";
  } else if (computer_score == player_score) {
    return "引き分けです。";
  } else if (computer_score > player_score) {
    return "あなたの負けです。";
  }
}

// ランダムにカードを取得する。$cardsから削除する。html要素に入れる。
function get_random(){
	// html要素を取得しカンマ区切りで配列に格納
	var resArray = document.getElementById('cards').innerText.split(',');
	// 配列からランダムなカードを取得
	var randomIndex = Math.floor(Math.random() * resArray.length);
	var retunCard = resArray[randomIndex];
	// 取得したカードを配列から削除
	resArray.splice(randomIndex, 1);
	// html要素に入れる
	document.getElementById('cards').innerText = resArray;
	// ランダムなカードを返す。
	return retunCard;
}

// canvasを削除する
function erase_card(element){
	var x=0, y=0, width=400, height=90;
	var canvas = document.getElementById(element);
	var ctx = canvas.getContext("2d");
	ctx.clearRect(x, y, width, height);
}

// 画面ロード時のイベント
window.onload = function() {
	// フッター表示
	var copyright = 'Copyright © ' + new Date().getFullYear() + '  Yanoo Japan - All Rights Reserved.';
	//document.getElementById('footer').getElementsByTagName('h4')[0].innerText = copyright;
	var elements = document.body.getElementsByTagName('h4');
	for (var i = 0; i < elements.length; i++) {
		elements[i].innerText = copyright;
	}
	
	// 初期画面の表示・非表示
	var elems = document.getElementsByClassName('init-hidden');
	for (var i = 0; i < elems.length; i++){
		elems[i].style.display = 'none';
	}
	// canvasをWindowサイズに合わせる
	document.getElementById('computer-canv').width = window.innerWidth;
	document.getElementById('player-canv').width = window.innerWidth;
	document.getElementById('opponent-canv').width = window.innerWidth;
	document.getElementById('oneself-canv').width = window.innerWidth;
}
