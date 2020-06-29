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

let data = [];

function dataDL() {
	var blob = new Blob([JSON.stringify(data)], {
		type: "text/plain"
	});
	var a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.target = '_blank';
	a.download = 'a.json';
	a.click();
	data = [];
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
		if (Qcicle % (num / 1000) == 0) {
			// console.log(2);
			var p = {
				first: Number(document.getElementById("wariMaru").innerHTML),
				second: Number(document.getElementById("wariBatsu").innerHTML),
				draw: Number(document.getElementById("wariDraw").innerHTML)
			}
			data.push(p);
			// resetTable();
		}
	}
}

function resetTable() {
	document.getElementById("Qcicle").innerHTML = 0;
	document.getElementById("draw").innerHTML = 0;
	document.getElementById("wariDraw").innerHTML = 0;
	document.getElementById("winMaru").innerHTML = 0;
	document.getElementById("wariMaru").innerHTML = 0;
	document.getElementById("winBatsu").innerHTML = 0;
	document.getElementById("wariBatsu").innerHTML = 0;
	Qcicle = 0;
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
	for (var rN = 0; rN < Math.pow(3, 3 * 3) * 9; rN++) {
		Q[qN][rN] = [];
		for (var sN = 0; sN < Math.pow(3, 2); sN++) {
			Q[qN][rN][sN] = 0;
		}
	}
}


const alpha = 0.5; //学習率
const gamma = 0.9; //割引率
const epsilon = 5; //%
const num = 1000000; //試行回数
let score = 100; //得点
let AITurn = -1; //0 先行 1 後攻 -1 両方

function AIstart(h) {
	AInum = h;
	boardReset();
	for (let i = 0; i < num; i++) {
		AIGame();
		boardReset();
		if(i%(num/100)==0){
			// resetTable();
		}
	}
}

let Qnum = 0; //0 maru 1 batsu
let Qposi = [0, 0];
let QBeforePosi = [0, 0];
let QNextPosi = [0, 0];
let selectLeft = [0, 0];
let Qcicle = 0;
let selectNumBuf = 1;
let Qmem = 0;

function AIGame() {
	console.log(1);
	selectNumBuf = 1;
	Qcicle++;
	let ep = epsilon;
	Qmem = 0;
	while (!endFlg) {
		var r = putStonePic(Qnum, ep);
		if (Qnum == AInum || AInum == -1) {
			var NN = selectLeft[Qnum] * 9 + QNextPosi[Qnum] + 1 + Qmem;
			Qmem += Math.pow(9, selectNumBuf);
			// if (selectNumBuf == 0) NN--; //first
			selectLeft[Qnum] = Math.pow(9, (selectNumBuf - 1)) * selectLeft[Qnum] + QNextPosi[Qnum];
			var g = 0;
			if (!endFlg) g = gamma * maxValue(Qnum, NN);
			Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] = Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] + alpha * (r + gamma * maxValue(Qnum, NN) - Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]]);
			QBeforePosi[Qnum] = Qposi[Qnum];
			Qposi[Qnum] = NN;
		}

		if (Qnum == 0) {
			Qnum = 1;
		} else {
			Qnum = 0;
			selectNumBuf++;
			// ep /= 2;
		}
	}
}

function putStonePic(q, ep) {
	let returnScore = 0;
	var spaceArr = searchStone();
	var i, l;
	if (Qnum == AInum || AInum == -1) {
		var e = Math.ceil( Math.random()*100 );
		if (e <= ep) {
			var r = Math.floor(Math.random() * (spaceArr.length));
			i = spaceArr[r][0];
			l = spaceArr[r][1];
		} else {
			var r = epsilonGreedy(spaceArr, q);
			i = r[0];
			l = r[1];
		}
	} else {
		var r = Math.floor(Math.random() * (spaceArr.length));
		i = spaceArr[r][0];
		l = spaceArr[r][1];
	}
	var d = document.getElementById("masu" + i + l);
	putStone(d);
	if (q == AInum || AInum == -1) {
		QNextPosi[q] = i * 3 + l;
	}
	if (endFlg) {
		if (drawFlg) {
			returnScore = 0;//-score / 8;
			if (q != AInum || AInum == -1) {
				q = (q == 0) ? 1 : 0;
				Q[q][QBeforePosi[q]][QNextPosi[q]] = Q[q][QBeforePosi[q]][QNextPosi[q]] + alpha * (returnScore  - Q[q][QBeforePosi[q]][QNextPosi[q]]);
			}
		} else {
			returnScore = score;
			if (q != AInum || AInum == -1) {
				q = (q == 0) ? 1 : 0;
				Q[q][QBeforePosi[q]][QNextPosi[q]] = Q[q][QBeforePosi[q]][QNextPosi[q]] + alpha * (-returnScore - Q[q][QBeforePosi[q]][QNextPosi[q]]);
			}
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
	let max = -score * 100;
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
	let max = -score;
	let qarr = (Q[q][n] == void 0) ? [] : Q[q][n];
	if (qarr.length == 0) max = 0;
	for (let i = 0; i < qarr.length; i++) {
		if (Q[q][n][i] >= max) {
			max = Q[q][n][i];
		}
	}
	return max;
}