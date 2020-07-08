var fs = require('fs');
var jsonData = [];

var s = [];
var next = [];
var a = [];
var rAll = [0, 0];
var alpha = 0.04;
var gamma = 0.9;
var epsilon = 0.04;
var win1 = 0;
var win2 = 0;
var draw = 0;
const episode = 100000;
const score = 1;

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

let board = [];
let boardlist = [];
let ep = 0;
let QCicle = 0;
let mode;
/*
	-1 Q vs Q
	0  Q vs R
	1  R vs Q
*/

function Main(m) {
	mode = m;
	console.log("episode" + episode);
	console.log("alpha" + alpha);
	console.log("gamma" + gamma);
	console.log("epsilon" + epsilon);
	var s1 = 0;
	var s2 = 0;
	for (var i = 0; i < episode; i++) {
		s1 = 0;
		s2 = 0;
		QCicle = i;
		boardClear();
		var end = 0;
		ep = epsilon;
		var q = 0;
		while (true) {
			s[q] = getState();
			a[q] = epsilonGreedy(q);
			board[a[q]] = q + 1;
			boardlist.splice(boardlist.indexOf(a[q]), 1);
			next[q] = getState();
			end = endGame(q);
			if (end != 0) {
				break;
			}

			if (q == 1) {
				if (mode == -1) {
					QCalculation(0, s1 * 0.001);
					QCalculation(1, s2 * 0.001);
				}
			}
			q = (q == 0) ? 1 : 0;
		}
		switch (end) {
			case 1:
				win1++;
				s1 = score;
				s2 = -score;
				break;
			case 2:
				win2++;
				s1 = -score;
				s2 = score;
				break;
			case 3:
				draw++;
				s1 = 0;
				s2 = 0;
				break;
		}

		if (mode == -1) {
			QCalculation(0, s1);
			QCalculation(1, s2);
		}

		rAll[0] += s1;
		rAll[1] += s2;
		if ((i + 1) % (episode / 100) == 0 && mode != -1) {
			let jd = {
				1: win1 / QCicle,
				2: win2 / QCicle,
				3: draw / QCicle,
				// 1: rAll[0] / QCicle,
				// 2: rAll[1] / QCicle,
			};
			jsonData.push(jd);
		}
	}
	fs.writeFileSync('./data.json', JSON.stringify(jsonData));
	console.log('\x1b[36m%s\x1b[0m', win1);
	console.log('\x1b[33m%s\x1b[0m', win2);
	console.log('\x1b[37m%s\x1b[0m', draw);
	win1 = 0;
	win2 = 0;
	draw = 0;
}

function QCalculation(q, i) {
	Q[q][s[q]][a[q]] = (1 - alpha) * Q[q][s[q]][a[q]] + alpha * (i + gamma * maxValue(q, next[q]));
}


function maxValue(q, n) {
	var max = -100 * score;
	for (var i = 0; i < 9; i++) {
		var r = Q[q][n][i];
		if (max < r) {
			max = r;
		}
	}
	return max;
}

function endGame(q) {
	q++;
	var endFlg = 0;
	if (board[0] == q && board[1] == q && board[2] == q) endFlg = q;
	if (board[3] == q && board[4] == q && board[5] == q) endFlg = q;
	if (board[6] == q && board[7] == q && board[8] == q) endFlg = q;
	if (board[0] == q && board[3] == q && board[6] == q) endFlg = q;
	if (board[1] == q && board[4] == q && board[7] == q) endFlg = q;
	if (board[2] == q && board[5] == q && board[8] == q) endFlg = q;
	if (board[0] == q && board[4] == q && board[8] == q) endFlg = q;
	if (board[2] == q && board[4] == q && board[6] == q) endFlg = q;

	if (endFlg == 0) {
		endFlg = 3;
		for (var i = 0; i < board.length; i++) {
			if (board[i] == 0) {
				endFlg = 0;
				break;
			}
		}
	}

	return endFlg;
}

function epsilonGreedy(q) {
	var r;
	if (mode != -1) {
		ep = 0;
	}
	if (Math.random() < ep || (mode != -1 && q != mode)) {
		r = boardlist[Math.floor(Math.random() * boardlist.length)];
	} else {
		var max = -100 * score;
		for (var i = 0; i < boardlist.length; i++) {
			if (max < Q[q][s[q]][boardlist[i]]) {
				max = Q[q][s[q]][boardlist[i]];
				r = boardlist[i];
			}
		}
	}

	return r;
}

function getState() {
	var r = 0;
	for (var i = 0; i < 9; i++) {
		r += Math.pow(3, i) * board[i];
	}
	return r;
}

function boardClear() {
	for (var i = 0; i < 9; i++) {
		board[i] = 0;
		boardlist[i] = i;
	}
}

Main(-1);
Main(1);
// Main(0);
// Main(-1);