package ox_game_test;


import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		Scanner scan = new Scanner(System.in);
		Random rand = new Random();

		int s1 = 0; //player1 状態
		int nexts1 = 0; //player1 次状態
		int a1 = 0; //player1 行動
		int r1 = 0; //player1 報酬


		int s2 = 0; //player2 状態
		int nexts2 = 0; //player2 次状態
		int a2 = 0; //player2 行動
		int r2 = 0; //player2 報酬


		double alpha = 0.04;
		double gamma = 0.9;

		int Owin = 0;
		int Xwin = 0;
		int draw = 0;

		int OwinR = 0;
		int XwinR = 0;
		int drawR = 0;

		int[] OwinToatl = new int[100];
		int[] XwinToatl = new int[100];
		int[] drawToatl = new int[100];
		double[] Oeff = new double[100];
		double[] Xeff = new double[100];


		int a = 0;

		double a1cnt = 0;
		double a2cnt = 0;
		double r1cnt = 0;
		double r2cnt = 0;

		int episode = 1;
		ArrayList < Integer > boardlist = new ArrayList < Integer > ();

		for (int count = 0; count < 1; count++) {
			double[][] Q1 = new double[19683][9]; //player1 Qテーブル
			double[][] Q2 = new double[19683][9]; //player2 Qテーブル

			for (episode = 1; episode < 110001; episode++) {

				String[] board = new String[9];
				boardlist.clear();

				for (int i = 0; i < board.length; i++) {
					board[i] = "＿";
					boardlist.add(i);
				}

				//System.out.println("First Board");
				//OutputBoard(board);

				while (true) {

					inputBoard(boardlist, board);

					//System.out.println("Input 〇 number 0～8");
					//int p1 = scan.nextInt();	//0～8
					s1 = getState(board);
					a1 = Egreedy(s1, Q1, board, boardlist, episode);
					a1cnt++;
					board[a1] = "〇";
					//OutputBoard(board);

					nexts1 = getState(board);

					if (judgeO(board)) {
						break;
					}
					if (isEnd(board)) {
						break;
					}
					if (episode < 100000) {
						Q1[s1][a1] = (1 - alpha) * Q1[s1][a1] + alpha * (r1 + gamma * MaxValue(nexts1, Q1));
					}


					inputBoard(boardlist, board);

					//System.out.println("Input × number 0～8");
					//int p2 = scan.nextInt();	//0～8
					s2 = getState(board);
					a2 = Egreedy(s2, Q2, board, boardlist, episode);
					a2cnt++;
					if (episode > 100001) {
						a2 = boardlist.get(rand.nextInt(boardlist.size()));
					}
					board[a2] = "×";
					//OutputBoard(board);

					nexts2 = getState(board);

					if (judgeX(board)) {
						break;
					}
					if (isEnd(board)) {
						break;
					}
					if (episode < 100000) {
						Q2[s2][a2] = (1 - alpha) * Q2[s2][a2] + alpha * (r2 + gamma * MaxValue(nexts2, Q2));
					}

				}

				//System.out.println("End Board");
				//OutputBoard(board);

				if (judgeO(board) == true && judgeX(board) == false) {
					r1 = 1;
					r2 = -1;
					if (episode > 100000) {
						OwinR++;
						//OutputBoard(board);
					} else if (episode > 90001) {
						Owin++;
						//System.out.println("〇 win!!");
					}

				} else if (judgeO(board) == false && judgeX(board) == true) {
					r1 = -1;
					r2 = 1;

					if (episode > 100000) {
						XwinR++;
						//OutputBoard(board);
					} else if (episode > 90001) {
						Xwin++;
						//System.out.println("× win!!");
					}

				} else if (judgeO(board) == false && judgeX(board) == false) {
					r1 = 0;
					r2 = 0;
					if (episode > 100000) {
						drawR++;
						//OutputBoard(board);
					} else if (episode > 90001) {
						draw++;
						//System.out.println("DRAW game");
					}
				}
				r1cnt += r1;
				r2cnt += r2;

				if (episode < 100000) {
					Q1[s1][a1] = (1 - alpha) * Q1[s1][a1] + alpha * (r1 + gamma * MaxValue(nexts1, Q1));
					Q2[s2][a2] = (1 - alpha) * Q2[s2][a2] + alpha * (r2 + gamma * MaxValue(nexts2, Q2));
				}

				if (episode % 10000 == 0) {
					System.out.println(episode);
				}



			}
		}



		System.out.println("TOTAL：" + (episode - 100001));
		System.out.println("〇win：" + Owin);
		System.out.println("×win：" + Xwin);
		System.out.println("draw：" + draw);

		System.out.println("TOTALrandom：" + (episode - 100001));
		System.out.println("〇win：" + OwinR);
		System.out.println("×win：" + XwinR);
		System.out.println("draw：" + drawR);

		/*
        System.out.println("Owin");
        for(int i = 0; i < OwinToatl.length; i++) {
        	System.out.println(OwinToatl[i]);
        }
        System.out.println("Xwin");
        for(int i = 0; i < XwinToatl.length; i++) {
        	System.out.println(XwinToatl[i]);
        }
        System.out.println("draw");
        for(int i = 0; i < drawToatl.length; i++) {
        	System.out.println(drawToatl[i]);
        }
        System.out.println("Oeff");
        for(int i = 0; i < Oeff.length; i++) {
        	System.out.println(Oeff[i]);
        }
        System.out.println("Xeff");
        for(int i = 0; i < Xeff.length; i++) {
        	System.out.println(Xeff[i]);
        }
		*/

		/*
		for(int i = 0; i < 19683; i++) {
			for(int j = 0; j < 9; j++) {
				if(Q1[i][j] > 0) {
					System.out.println("satate1:"+i+"act1"+j+"Q1:"+ Q1[i][j]);
				}
				if(Q2[i][j] > 0) {
					System.out.println("satate2:"+i+"act2"+j+"Q2:"+ Q2[i][j]);
				}
			}
		}
		*/
	}




	private static boolean isEnd(String[] board) {
		boolean end = true;
		for (int i = 0; i < board.length; i++) {
			if (board[i].equals("＿")) {
				end = false;
			}
		}
		return end;
	}

	private static void inputBoard(ArrayList < Integer > boardlist, String[] board) {

		for (int i = 0; i < board.length; i++) {
			if (board[i].equals("〇") || board[i].equals("×")) {
				if (boardlist.contains(i)) {
					boardlist.remove(boardlist.indexOf(i)); //iを消す
				}
			}
		}
	}

	private static void OutputBoard(String[] board) {

		for (int i = 0; i < board.length; i++) {
			System.out.print(board[i]);
			if (i == 2 || i == 5 || i == 8) {
				System.out.println("");
			}
		}
		System.out.println("");
	}

	private static boolean judgeO(String[] board) {
		boolean o = false;

		if (board[0].equals("〇") && board[1].equals("〇") && board[2].equals("〇")) o = true;
		if (board[3].equals("〇") && board[4].equals("〇") && board[5].equals("〇")) o = true;
		if (board[6].equals("〇") && board[7].equals("〇") && board[8].equals("〇")) o = true;
		if (board[0].equals("〇") && board[3].equals("〇") && board[6].equals("〇")) o = true;
		if (board[1].equals("〇") && board[4].equals("〇") && board[7].equals("〇")) o = true;
		if (board[2].equals("〇") && board[5].equals("〇") && board[8].equals("〇")) o = true;
		if (board[0].equals("〇") && board[4].equals("〇") && board[8].equals("〇")) o = true;
		if (board[2].equals("〇") && board[4].equals("〇") && board[6].equals("〇")) o = true;

		return o;
	}


	private static boolean judgeX(String[] board) {
		boolean x = false;

		if (board[0].equals("×") && board[1].equals("×") && board[2].equals("×")) x = true;
		if (board[3].equals("×") && board[4].equals("×") && board[5].equals("×")) x = true;
		if (board[6].equals("×") && board[7].equals("×") && board[8].equals("×")) x = true;
		if (board[0].equals("×") && board[3].equals("×") && board[6].equals("×")) x = true;
		if (board[1].equals("×") && board[4].equals("×") && board[7].equals("×")) x = true;
		if (board[2].equals("×") && board[5].equals("×") && board[8].equals("×")) x = true;
		if (board[0].equals("×") && board[4].equals("×") && board[8].equals("×")) x = true;
		if (board[2].equals("×") && board[4].equals("×") && board[6].equals("×")) x = true;

		return x;

	}

	private static int getState(String[] board) {
		int state = 0;
		int tmp = 0;
		for (int i = 0; i < board.length; i++) {
			if (board[i].equals("〇")) {
				tmp = 1;
			} else if (board[i].equals("×")) {
				tmp = 2;
			} else if (board[i].equals("＿")) {
				tmp = 0;
			}
			state += Math.pow(3, i) * tmp;
		}
		return state;
	}

	private static int Egreedy(int s, double[][] q, String[] board, ArrayList < Integer > boardlist, int episode) {
		Random rand = new Random();
		double epsilon = 0.04; //値を1以上にすれば完全ランダム
		int act = 0;
		double max = -100;

		if (episode > 100000) {
			epsilon = 0;
		}

		if (Math.random() < epsilon) {
			act = boardlist.get(rand.nextInt(boardlist.size()));
			//System.out.println(act);
		} else {
			for (int i = 0; i < boardlist.size(); i++) {
				if (max < q[s][boardlist.get(i)]) {
					max = q[s][boardlist.get(i)];
					act = boardlist.get(i);
				}
			}
		}
		//System.out.println(act);
		return act;
	}

	private static double MaxValue(int nexts, double[][] q) {

		double max = -100;
		double r;

		for (int i = 0; i < 9; i++) {
			r = q[nexts][i];
			if (max < r) {
				max = r;
			}
		}

		return max;
	}




}