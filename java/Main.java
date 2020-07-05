import java.util.*;


public class Main {
	public static ArrayList < Integer > boardlist = new ArrayList < Integer > ();
	public static int[] board = new int[9];
	public static double[][][] Q = new double[2][19683][9];
	public static int[] s = new int[2];
	public static int[] next = new int[2];
	public static int[] a = new int[2];
	public static int[] r = new int[2];
	public static double alpha = 0.04;
	public static double gamma = 0.9;
	public static double epsilon = 0.04;
	public static void main(String[] args) {
		Random rand = new Random();

		int Owin = 0;
		int Xwin = 0;
		int draw = 0;

		int episode = 0;
		for (episode = 0; episode < 100000; episode++) {
			int endInt = 0;
			boardClear();
			while (true) {
				s[0] = getState();
				a[0] = Egreedy(0);
				board[a[0]] = 1;
				boardlist.remove(boardlist.indexOf(a[0]));
				next[0] = getState();
				endInt = endGame(0);
				if (endInt!=0) {
					break;
				}
				s[1] = getState();
				a[1] = Egreedy(1);
				board[a[1]] = 2;
				boardlist.remove(boardlist.indexOf(a[1]));
				next[1] = getState();
				endInt = endGame(1);
				if (endInt!=0) {
					break;
				}

				Q[0][s[0]][a[0]] = (1 - alpha) * Q[0][s[0]][a[0]] + alpha * (r[0] + gamma * MaxValue(next[0],0));
				Q[1][s[1]][a[1]] = (1 - alpha) * Q[1][s[1]][a[1]] + alpha * (r[1] + gamma * MaxValue(next[1],1));

			}
			if (endInt == 1) {
				r[0] = 1;
				r[1] = -1;
				Owin++;
			} else if (endInt == 2) {
				r[0] = -1;
				r[1] = 1;
				Xwin++;
			} else if (endInt == 3) {
				r[0] = 0;
				r[1] = 0;
				draw++;
			}

			Q[0][s[0]][a[0]] = (1 - alpha) * Q[0][s[0]][a[0]] + alpha * (r[0] + gamma * MaxValue(next[0],0));
			Q[1][s[1]][a[1]] = (1 - alpha) * Q[1][s[1]][a[1]] + alpha * (r[1] + gamma * MaxValue(next[1],1));

			if (episode % 10000 == 0) {
				System.out.println(episode);
			}

		}

		System.out.println("TOTAL:" + episode);
		System.out.println("owin:" + Owin);
		System.out.println("xwin:" + Xwin);
		System.out.println("draw:" + draw);
	}

	private static void boardClear() {
		boardlist.clear();
		for (int i = 0; i < board.length; i++) {
			board[i] = 0;
			boardlist.add(i);
		}
	}

	private static int endGame(int i) {
		int flg = 0;
		i++;
		if (board[0] == i && board[1] == i && board[2] == i) flg = i;
		if (board[3] == i && board[4] == i && board[5] == i) flg = i;
		if (board[6] == i && board[7] == i && board[8] == i) flg = i;
		if (board[0] == i && board[3] == i && board[6] == i) flg = i;
		if (board[1] == i && board[4] == i && board[7] == i) flg = i;
		if (board[2] == i && board[5] == i && board[8] == i) flg = i;
		if (board[0] == i && board[4] == i && board[8] == i) flg = i;
		if (board[2] == i && board[4] == i && board[6] == i) flg = i;

		if (flg == 0) {
			flg = 3;
			for (int p = 0; p < board.length; p++) {
				if (board[p] == 0) {
					flg = 0;
					break;
				}
			}
		}
		return flg;
	}

	private static int getState() {
		int state = 0;
		for (int i = 0; i < board.length; i++) {
			state += Math.pow(3, i) * board[i];
		}
		return state;
	}

	private static int Egreedy(int p) {
		Random rand = new Random();
		int act = 0;
		if (Math.random() < epsilon) {
			act = boardlist.get(rand.nextInt(boardlist.size()));
		} else {
			double max = -100;
			for (int i = 0; i < boardlist.size(); i++) {
				if (max < Q[p][s[p]][boardlist.get(i)]) {
					max = Q[p][s[p]][boardlist.get(i)];
					act = boardlist.get(i);
				}
			}
		}
		return act;
	}

	private static double MaxValue(int nexts, int q) {
		double max = -100;
		for (int i = 0; i < 9; i++) {
			double r = Q[q][nexts][i];
			if (max < r) {
				max = r;
			}
		}

		return max;
	}
}