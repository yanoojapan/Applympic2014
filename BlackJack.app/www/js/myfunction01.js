/**
 * 
 */

function btn_0101(){
	// ゲームスタート時に表示にする。
	var elems = document.getElementsByClassName('init-hidden');
	for (var i = 0; i< elems.length; i++){
			elems[i].style.display = 'block';
	}
	document.getElementById('result01').style.display = 'none';
	
	// カードを一旦削除する
	erase_card('computer-canv');
	erase_card('player-canv');
	
	// 初回カードを配布する。
	document.getElementById('cards').innerText = 's01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13,h01,h02,h03,h04,h05,h06,h07,h08,h09,h10,h11,h12,h13,c01,c02,c03,c04,c05,c06,c07,c08,c09,c10,c11,c12,c13,d01,d02,d03,d04,d05,d06,d07,d08,d09,d10,d11,d12,d13';
	var strCard='', arrayCards=[];
 	for (var i = 0; i < 2; i++ ){
		arrayCards.push(get_random());
	}
	// 配列をhtml要素に入れる
	document.getElementById('computer-cards').innerText = arrayCards;
  // Playerのカードを表示
	var strCard='', arrayCards=[];
  for (var i = 0; i < 2; i++ ){
		arrayCards.push(get_random());
	}
	// 配列をhtml要素に入れる
	document.getElementById('player-cards').innerText = arrayCards;
	// カードを表示する。
	display_card_common00('computer', 1000);
	display_card_common00('player', 2000);
	document.getElementById('btn-0101').style.display = 'none';
	
	// ボタンを一定時間非活性
	document.getElementById('btn-0103').disabled = 'disabled';
	document.getElementById('btn-0104').disabled = 'disabled';
	setTimeout(function(){
		document.getElementById('btn-0103').disabled = '';
		document.getElementById('btn-0104').disabled = '';
	}, 4000);
}

function btn_0102(){
	// 非表示
	var elems = document.getElementsByClassName('init-hidden');
	for (var i = 0; i < elems.length; i++){
		elems[i].style.display = 'none';
	}
	document.getElementById('btn-0101').style.display = 'block';
	history.back();
}

function btn_0103(){
	// Playerのカードを表示
	// html要素からカードを取得
	var arrayCards = document.getElementById('player-cards').innerHTML.split(',');
	arrayCards.push(get_random());
	// html要素に入れる
	document.getElementById('player-cards').innerText = arrayCards;
	// カード表示
	display_card_common01('player');
}

function btn_0104(){
	// 勝敗表示
	document.getElementById('btn-0101').style.display = 'block';
	document.getElementById('btn-0103').style.display = 'none';
	document.getElementById('btn-0104').style.display = 'none';
	document.getElementById('result01').style.display = 'block';
	for (var i = 0; i < 5; i++){
		if(computer_exec() == 'false'){
			break;
		}
	}
	document.getElementById('result01').innerHTML = '対戦相手の点数：' + display_score('computer') + '<br>あなたの点数：' + display_score('player') + '<br>' + get_result(display_score('computer'), display_score('player'));

}

// Computerの処理をする。
// 引数：Computerの現在の合計点、$cards
// 戻り値：false、または、ランダムに選択されたカード。
function computer_exec() {
	// computerの点数を取得
	var cards = document.getElementById('computer-cards').innerHTML.split(',');
	var score = 0;
	for (var i = 0; i < cards.length; i++){
		if (parseInt(cards[i].match(/\d+/)) > 10){
			score += 10;
		} else {
			score += parseInt(cards[i].match(/\d+/));
		}
	}
  // 目標の点数
  var target_score = 19;
  
  // カードをめくるか否かを判断する。
  // score >= target_score の場合はカードを引かない
  if (score >= target_score){
    return 'false';
  
    // $score < $target_score-9 の場合はカードを引く。
  } else if (score < target_score - 9) {
		// html要素からカードを取得
		var arrayCards = document.getElementById('computer-cards').innerHTML.split(',');
		arrayCards.push(get_random());
		// html要素に入れる
		document.getElementById('computer-cards').innerText = arrayCards;
		// カード表示
		display_card_common01('computer');
    
    // 合計点によりカードを引く確率を変化させる配列を作る。要素は10個。
  } else {
    var prob_array = [];
    for (var i = 0; i < 10 ;i++){
      if (i < target_score - score) {
        prob_array.push('1');
      } else {
        prob_array.push('0');
      }
    }
		
		var randomIndex = Math.floor(Math.random() * prob_array.length);
    // 0ならカードを引かない。1ならカードを引く。
    if (prob_array[randomIndex] == 0){
      return 'false';
    } else{
		// html要素からカードを取得
		var arrayCards = document.getElementById('computer-cards').innerHTML.split(',');
		arrayCards.push(get_random());
		// html要素に入れる
		document.getElementById('computer-cards').innerText = arrayCards;
		// カード表示
		display_card_common01('computer');
    }
  }
}
