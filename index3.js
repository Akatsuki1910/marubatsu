const alpha = 0.04;
const gamma = 0.9;
const epsilon = 0.04;
const episode = 10;
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
	console.log("episode:" + episode);
	console.log("alpha" + alpha + " gamma" + gamma + " epsilon" + epsilon);
	console.log("Q vs Q");
	AIstart(-1);
}

function AIstart(mode) {
	for (var i = 0; i < episode; i++) {
		boardReset();
		AIGame(mode);
	}
	console.log('\x1b[36m%s\x1b[0m', win1);
	console.log('\x1b[33m%s\x1b[0m', win2);
	console.log('\x1b[37m%s\x1b[0m', draw);
	win1=0;
	win2=0;
	draw=0;
}

let state = [0, 0];
let eg = [0, 0];
let stateNext = [0, 0];
let drawFlg = false;
let Qmem = [0, 0];

function AIGame(mode) {
	let Qnum = 0;
	drawFlg = false;
	while (true) {
		state[Qnum] = getState();
		eg[Qnum] = epsilonGreedy(Qnum, mode);
		board[eg[Qnum]] = Qnum + 1;
		stateNext[Qnum] = getState();
		if (endGame(Qnum)) {
			break;
		}
		Qmem[Qnum] = Q[Qnum][state[Qnum]][eg[Qnum]];
		QCalculation(Qnum, 0);
		Qnum = (Qnum == 0) ? 1 : 0;
	}
	let s;
	if(drawFlg){
		s=0;
		draw++;
	}else{
		s=score;
		if(Qnum==0){
			win1++;
		}else{
			win2++;
		}
	}
	QCalculation(Qnum, s);
	Qnum = (Qnum == 0) ? 1 : 0;
	Q[Qnum][state[Qnum]][eg[Qnum]] = Qmem[Qnum];
	QCalculation(Qnum, -s);
}

function boardReset() {
	for (var i = 0; i < 9; i++) {
		board[i] = 0;
	}
}

function getState() {
	var r = 0;
	for (var i = 0; i < board.length; i++) {
		if(board[i]==void 0)console.log("error");
		r += Math.pow(3, i) * board[i];
	}
	return r;
}

function epsilonGreedy(q, mode) {
	const ssArr = searchStone();
	// ssArr.forEach(element => {
	// 	console.log(element);
	// });console.log("-------");
	const r = Math.floor(Math.random() * (ssArr.length));

	let e;
	let max = -score * 100;
	for (let i = 0; i < ssArr.length; i++) {
		if (max < Q[q][state[q]][ssArr[i]]) {
			e = ssArr[i];
			max = Q[q][state[q]][ssArr[i]];
		}
	}

	let eg;
	// if (mode == -1) {
		eg = (Math.random() < epsilon) ? ssArr[r] : e;
	// } else {
	// 	eg = (q == mode) ? e : ssArr[r];
	// }
	return eg;
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

function endGame(q) {
	let endFlg = false;
	q = q+1;
	if (q == board[1] && q == board[2] && board[0] == q) endFlg = true;
	if (q == board[4] && q == board[5] && board[3] == q) endFlg = true;
	if (q == board[7] && q == board[8] && board[6] == q) endFlg = true;
	if (q == board[3] && q == board[6] && board[0] == q) endFlg = true;
	if (q == board[4] && q == board[7] && board[1] == q) endFlg = true;
	if (q == board[5] && q == board[8] && board[2] == q) endFlg = true;
	if (q == board[4] && q == board[8] && board[0] == q) endFlg = true;
	if (q == board[4] && q == board[6] && board[2] == q) endFlg = true;

	if (!endFlg) {
		drawFlg = true;
		endFlg = true;
		for (var i = 0; i < board.length; i++) {
			if (board[i] == 0) {
				drawFlg = false;
				endFlg = false;
				break;
			}
		}
	}
	return endFlg;
}

function QCalculation(q, i) {
	Q[q][state[q]][eg[q]] = (1 - alpha) * Q[q][state[q]][eg[q]] + alpha * (i + gamma * maxValue(q, stateNext[q]));
}

function maxValue(q, n) {
	let max = -score * 100;
	for (let i = 0; i < Q[q][n].length; i++) {
		if (Q[q][n][i] > max) {
			max = Q[q][n][i];
		}
	}
	return max;
}

Main();