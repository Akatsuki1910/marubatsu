let Qposi = [0, 0];
let QNextPosi = [0, 0];
let gammaMem = [0, 0];
let NN = [0, 0];

const alpha = 0.1;
const gamma = 0.95;
const epsilon = 0.2; //%
const episode = 100000;
const score = 1;

let win1 = 0;
let win2 = 0;
let draw = 0;

let board = [];
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

function Main() {
	console.log("Q vs Q");
	AIstart(-1);
	console.log("Q vs R");
	AIstart(0);
	console.log("R vs Q");
	AIstart(1);
}

function pointClear() {
	win1 = 0;
	win2 = 0;
	draw = 0;
}

let Qcicle = 0;

function AIstart(h) {
	Qcicle = 0;
	boardReset();
	for (let i = 0; i < episode; i++) {
		AIGame(h);
		boardReset();
	}
	console.log(win1);
	console.log(win2);
	console.log(draw);
	pointClear();
}

let endFlg = false;

function AIGame(h) {
	let Qnum = 0; //0 maru 1 batsu
	Qcicle++;
	endFlg = false;
	while (!endFlg) {
		Qposi[Qnum] = returnQ();
		var r = putStonePic(Qnum, h);
		if (h == -1) {
			NN[Qnum] = returnQ();
			QCalculation(Qnum, r);
		}
		Qnum = (Qnum == 0) ? 1 : 0;
	}
}

function returnQ() {
	let r = 0;
	for (let i = 0; i < 9; i++) {
		r += Math.pow(3, i) * board[i];
	}
	return r;
}

function putStonePic(q, h) {
	let returnScore = 0;
	let spaceArr = searchStone();
	let i;
	const r = Math.floor(Math.random() * (spaceArr.length));
	const e = epsilonGreedy(spaceArr, q);
	if (h == -1) {
		i = (Math.random() < epsilon) ? spaceArr[r] : e;
	} else {
		i = (q == h) ? e : spaceArr[r];
	}
	QNextPosi[q] = i;
	const flg = putStone(i, q);
	if (endFlg && h == -1) {
		returnScore = (flg) ? 0 : score;
		const p = (q == 0) ? 1 : 0;
		QCalculation(p, -returnScore);

		// let s = "";
		// for (var k = 0; k < 9; k++) {
		// 	s += board[k];
		// }
		// if (flg) q = 2;
		// console.log(s, q);
	}
	return returnScore;
}

function searchStone() {
	let rArr = [];
	for (let i = 0; i < 9; i++) {
		if (board[i] == 0) {
			rArr.push(i);
		}
	}
	return rArr;
}

function epsilonGreedy(arr, q) {
	let rArr = 0;
	let max = -score * 100;
	for (let i = 0; i < arr.length; i++) {
		if (max <= Q[q][Qposi[q]][arr[i]]) {
			rArr = arr[i];
			max = Q[q][Qposi[q]][arr[i]];
		}
	}
	return rArr;
}

function putStone(x, q) {
	let drawFlg = true;
	board[x] = (q + 1);

	//yoko
	for (let i = 0; i < 3; i++) {
		let f = true;
		for (let l = 0; l < 3 - 1; l++) {
			const p = i * 3 + l;
			if (board[p] == 0 || board[p] != board[p + 1]) {
				f = false;
				break;
			}
		}
		if (f) {
			endFlg = true;
			break;
		}
	}

	//tate
	for (let i = 0; i < 3; i++) {
		let f = true;
		for (let l = 0; l < 3 - 1; l++) {
			const p = l * 3 + i;
			if (board[p] == 0 || board[p] != board[p + 3]) {
				f = false;
				break;
			}
		}
		if (f) {
			endFlg = true;
			break;
		}
	}

	//naname
	let f = true;
	for (let i = 0; i < 3 - 1; i++) {
		const p = i * 3 + i;
		if (board[p] == 0 || board[p] != board[p + 3 + 1]) {
			f = false;
			break;
		}
	}
	if (f) {
		endFlg = true;
	}

	if (!endFlg) {
		for (let i = 0; i < 9; i++) {
			if (0 == board[i]) {
				drawFlg = false;
			}
		}
		if (drawFlg) endFlg = true;
	} else {
		drawFlg = false;
	}

	// if (episode - 100000 <= Qcicle) {
	if (endFlg) {
		if (drawFlg) {
			draw++;
		} else {
			if (q == 0) {
				win1++;
			} else {
				win2++;
			}
		}
	}
	// }
	return drawFlg;
}

function boardReset() {
	for (var i = 0; i < 9; i++) {
		board[i] = 0;
	}
}

function maxValue(q, n) {
	let max = -score * 100;
	for (let i = 0; i < Q[q][n].length; i++) {
		if (Q[q][n][i] >= max) {
			max = Q[q][n][i];
		}
	}
	return max;
}

function QCalculation(p, score) {
	gammaMem[p] = gamma * maxValue(p, NN[p]);
	Q[p][Qposi[p]][QNextPosi[p]] = (1 - alpha) * Q[p][Qposi[p]][QNextPosi[p]] + alpha * (score + gammaMem[p]);
}

Main();