window.onload = () => {
	for (let i = 0; i < 3; i++) {
		for (let l = 0; l < 3; l++) {
			document.getElementById("masu" + i + l).onclick = (e) => {
				putStone(e.target);
			}
		}
	}
	startGame();
}

let turnFlg = true;
let endFlg = false;

function putStone(e) {
	if (!endFlg) {
		e.innerHTML = turnFlg ? "○" : "×";
		turnFlg = !turnFlg;
		document.getElementById("turn").innerHTML = (turnFlg) ? "マルの番です" : "バツの番です";
	}
	if (checkGame() && !endFlg) {
		endFlg = true;
		document.getElementById("turn").innerHTML = (winner == "draw") ? "あいこです" : winner + "の勝ちです";
		switch (winner) {
			case "draw":
				document.getElementById("draw").innerHTML++;
				document.getElementById("wariDraw").innerHTML = (document.getElementById("draw").innerHTML / Qcicle).toFixed(2);
				break;
			case "○":
				document.getElementById("winMaru").innerHTML++;
				document.getElementById("wariMaru").innerHTML = (document.getElementById("winMaru").innerHTML / Qcicle).toFixed(2);
				break;
			case "×":
				document.getElementById("winBatsu").innerHTML++;
				document.getElementById("wariBatsu").innerHTML = (document.getElementById("winBatsu").innerHTML / Qcicle).toFixed(2);
				break;
		}
		document.getElementById("Qcicle").innerHTML++;
	}
}

function boardReset() {
	for (let i = 0; i < 3; i++) {
		for (let l = 0; l < 3; l++) {
			document.getElementById("masu" + i + l).innerHTML = "&nbsp";
		}
	}
	turnFlg = true;
	startGame();
}

function startGame() {
	document.getElementById("turn").innerHTML = (turnFlg) ? "マルの番です" : "バツの番です";
	winner = "";
	endFlg = false;
	Qnum = 0; //0 maru 1 batsu
	Qposi = [0, 0];
	QNextPosi = [0, 0];
	selectNumBuf = 0;
	selectLeft = [0, 0];
}

let winner = "";
let drawFlg = true;

function checkGame() {
	let board = [];
	let flg = false;
	drawFlg = true;
	for (let i = 0; i < 3; i++) {
		board[i] = [];
		for (let l = 0; l < 3; l++) {
			board[i][l] = document.getElementById("masu" + i + l).innerHTML;
			if (board[i][l] == "&nbsp;") {
				drawFlg = false;
			}
		}
	}
	if (board[0][0] != "&nbsp;" && board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
		flg = true;
		drawFlg = false;
		winner = board[0][0];
	} else if (board[0][2] != "&nbsp;" && board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
		flg = true;
		drawFlg = false;
		winner = board[0][2];
	} else if (board[0][0] != "&nbsp;" && board[0][0] == board[0][1] && board[0][1] == board[0][2]) {
		flg = true;
		drawFlg = false;
		winner = board[0][0];
	} else if (board[1][0] != "&nbsp;" && board[1][0] == board[1][1] && board[1][1] == board[1][2]) {
		flg = true;
		drawFlg = false;
		winner = board[1][0];
	} else if (board[2][0] != "&nbsp;" && board[2][0] == board[2][1] && board[2][1] == board[2][2]) {
		flg = true;
		drawFlg = false;
		winner = board[2][0];
	} else if (board[0][0] != "&nbsp;" && board[0][0] == board[1][0] && board[1][0] == board[2][0]) {
		flg = true;
		drawFlg = false;
		winner = board[0][0];
	} else if (board[0][1] != "&nbsp;" && board[0][1] == board[1][1] && board[1][1] == board[2][1]) {
		flg = true;
		drawFlg = false;
		winner = board[0][1];
	} else if (board[0][2] != "&nbsp;" && board[0][2] == board[1][2] && board[1][2] == board[2][2]) {
		flg = true;
		drawFlg = false;
		winner = board[0][2];
	} else if (drawFlg) {
		flg = true;
		winner = "draw";
	}
	return flg;
}

let Q = [];
for (var qN = 0; qN < 2; qN++) {
	Q[qN] = [];
	for (var rN = 0; rN < Math.pow(3, 3 * 3); rN++) {
		Q[qN][rN] = [];
		for (var sN = 0; sN < Math.pow(3, 2); sN++) {
			Q[qN][rN][sN] = 0;
		}
	}
}


const alpha = 0.5; //学習率
const gamma = 0.99; //割引率
const epsilon = 5; //%
const num = 10000; //試行回数

function AIstart() {
	for (let i = 0; i < num; i++) {
		AIGame();
		boardReset();
	}
	boardReset();
}

let Qnum = 0; //0 maru 1 batsu
let Qposi = [0, 0];
let QBeforePosi = [0, 0];
let QNextPosi = [0, 0];
let selectNumBuf = 0;
let selectLeft = [0, 0];
let turnCorrection = 1;
let Qcicle = 0;

function AIGame() {
	console.log(1);
	Qcicle++;
	let tc = turnCorrection;
	let ep = epsilon;
	while (!endFlg) {
		var r = putStonePic(Qnum);
		var NN = Math.pow(9, selectNumBuf) + selectLeft[Qnum] + QNextPosi[Qnum];
		if (selectNumBuf == 0) {
			NN--;
		} //first
		selectLeft[Qnum] = Math.pow(9, selectNumBuf) * selectLeft[Qnum] + QNextPosi[Qnum];
		if (Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] == void 0) {
			Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] = 0;
		}
		Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] = (1 - alpha) * Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] + alpha * (r + gamma * maxValue(Qnum, NN));
		QBeforePosi[Qnum] = Qposi[Qnum];
		Qposi[Qnum] = NN;
		if (Qnum == 0) {
			Qnum = 1;
		} else {
			Qnum = 0;
			selectNumBuf++;
			tc++;
		}
		ep /= 2;
	}
}

function putStonePic(q) {
	let returnScore = 0;
	var spaceArr = searchStone();
	var e = Math.floor(Math.random() * 100 + 1);
	var i, l;
	if (e <= epsilon) {
		var r = Math.floor(Math.random() * (spaceArr.length));
		i = spaceArr[r][0];
		l = spaceArr[r][1];
	} else {
		var r = epsilonGreedy(spaceArr, q);
		i = r[0];
		l = r[1];
	}
	var d = document.getElementById("masu" + i + l);
	putStone(d);
	QNextPosi[q] = i * 3 + l;
	if (endFlg) {
		if (drawFlg) {
			//draw
			returnScore = 5;
			q = (q == 0) ? 1 : 0;
			Q[q][QBeforePosi[q]][QNextPosi[q]] = (1 - alpha) * Q[q][QBeforePosi[q]][QNextPosi[q]] + alpha * (returnScore + gamma * maxValue(q, Qposi[q]));
		} else {
			returnScore = 10;
			q = (q == 0) ? 1 : 0;
			Q[q][QBeforePosi[q]][QNextPosi[q]] = (1 - alpha) * Q[q][QBeforePosi[q]][QNextPosi[q]] + alpha * (-returnScore + gamma * maxValue(q, Qposi[q]));
		}
	}
	return returnScore;
}

function searchStone() {
	let rArr = [];
	for (let i = 0; i < 3; i++) {
		for (let l = 0; l < 3; l++) {
			const s = document.getElementById("masu" + i + l).innerHTML;
			if (s == "&nbsp;") {
				rArr.push([i, l]);
			}
		}
	}
	return rArr;
}

function epsilonGreedy(arr, q) {
	let rArr = [];
	let max = -100;
	for (let i = 0; i < arr.length; i++) {
		var il = arr[i][0] * 3 + arr[i][1];
		if (Q[q][Qposi[q]][il] == void 0) {
			Q[q][Qposi[q]][il] = 0;
		}
		if (max <= Q[q][Qposi[q]][il]) {
			rArr = [arr[i][0], arr[i][1]];
			max = Q[q][Qposi[q]][il];
		}
	}
	return rArr;
}

function maxValue(q, n) {
	let max = -100;
	let qarr = (Q[q][n] == void 0) ? [] : Q[q][n];
	if (qarr.length == 0) max = 0;
	for (let i = 0; i < qarr.length; i++) {
		if (Q[q][n][i] >= max) {
			max = Q[q][n][i];
		}
	}
	return max;
}