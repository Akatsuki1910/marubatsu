window.onload = () => {
	for (let i = 0; i < 3; i++) {
		for (let l = 0; l < 3; l++) {
			document.getElementById("masu" + i + l).onclick = (e) => putStone(e.target);
		}
	}
	startGame();
};

let data = [];

function dataDL() {
	var blob = new Blob([JSON.stringify(data)], {
		type: "text/plain"
	});
	var a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.target = '_blank';
	a.download = 'data.json';
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
				break;
			case "○":
				document.getElementById("winMaru").innerHTML++;
				break;
			case "×":
				document.getElementById("winBatsu").innerHTML++;
				break;
		}
		document.getElementById("wariDraw").innerHTML = (document.getElementById("draw").innerHTML / Qcicle).toFixed(2);
		document.getElementById("wariMaru").innerHTML = (document.getElementById("winMaru").innerHTML / Qcicle).toFixed(2);
		document.getElementById("wariBatsu").innerHTML = (document.getElementById("winBatsu").innerHTML / Qcicle).toFixed(2);
		document.getElementById("Qcicle").innerHTML++;
		if (Qcicle % (num / 1000) == 0) {
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
	gammaMem = [0, 0];
	NN = [0, 0];
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


const alpha = 0.1; //学習率
const gamma = 0.9; //割引率
const epsilon = 10; //%
let num = 30000; //試行回数
let score = 10; //得点
let AITurn = -1; //0 先行 1 後攻 -1 両方

function AIstart(h) {
	AInum = h;
	boardReset();
	let ep = (AITurn == -1) ? epsilon : 0;
	for (let i = 0; i < num; i++) {
		AIGame(ep);
		boardReset();
	}
}

let Qnum = 0; //0 maru 1 batsu
let Qposi = [0, 0];
let QNextPosi = [0, 0];
let Qcicle = 0;
let gammaMem = [0, 0];
let NN = [0, 0];

function AIGame(ep) {
	Qcicle++;
	gammaMem = [0, 0];
	// console.log(AInum);
	while (!endFlg) {
		Qposi[Qnum] = returnQ();
		var r = putStonePic(Qnum, ep);
		if (AInum == -1) {
			NN[Qnum] = returnQ();
			gammaMem[Qnum] = gamma * maxValue(Qnum, NN[Qnum]);
			Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] = (1 - alpha) * Q[Qnum][Qposi[Qnum]][QNextPosi[Qnum]] + alpha * (r + gammaMem[Qnum]);
		}

		if (Qnum == 0) {
			Qnum = 1;
		} else {
			Qnum = 0;
		}
	}
}

function putStonePic(q, ep) {
	let returnScore = 0;
	let spaceArr = searchStone();
	let i, l;
	const r = Math.floor(Math.random() * (spaceArr.length));
	const e = epsilonGreedy(spaceArr, q);
	if (AInum == -1) {
		const epRan = Math.floor(Math.random() * 100); //0~99
		if (epRan < ep) {
			i = spaceArr[r][0];
			l = spaceArr[r][1];
		} else {
			i = e[0];
			l = e[1];
		}
	} else if (q == AInum) {
		i = e[0];
		l = e[1];
	} else {
		i = spaceArr[r][0];
		l = spaceArr[r][1];
	}
	QNextPosi[q] = i * 3 + l;
	const d = document.getElementById("masu" + i + l);
	putStone(d);
	if (endFlg) {
		returnScore = (drawFlg)?0:score;
		if (AInum == -1) {
			console.log(AInum);
			const p = (q == 0) ? 1 : 0;
			Q[p][Qposi[p]][QNextPosi[p]] = (1 - alpha) * Q[p][Qposi[p]][QNextPosi[p]] + alpha * (-returnScore + gammaMem[p]);
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

function returnQ() {
	let r = 0;
	for (let i = 0; i < 3; i++) {
		for (let l = 0; l < 3; l++) {
			const s = document.getElementById("masu" + i + l).innerHTML;
			const t = Math.pow(3, i * 3 + l);
			if (s == "&nbsp;") {
				r += t * 0;
			} else if (s == "○") {
				r += t * 1;
			} else {
				r += t * 2;
			}
		}
	}
	return r;
}

function epsilonGreedy(arr, q) {
	let rArr = [];
	let max = -score * 100;
	for (let i = 0; i < arr.length; i++) {
		var il = arr[i][0] * 3 + arr[i][1];
		if (max <= Q[q][Qposi[q]][il]) {
			rArr = [arr[i][0], arr[i][1]];
			max = Q[q][Qposi[q]][il];
		}
	}
	return rArr;
}

function maxValue(q, n) {
	let max = -score * 100;
	for (let i = 0; i < 9; i++) {
		if (Q[q][n][i] >= max) {
			max = Q[q][n][i];
		}
	}
	return max;
}