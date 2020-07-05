using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;

namespace MaruBatsuQL
{
	class Program
	{
		public const double alpha = 0.5;
		public const double gamma = 0.9;
		public const double epsilon = 0.1;
		public const int episode = 100000;
		public const int score = 1;
		public static double[][][] Q = new double[2][][];
		public static int[] board = new int[9];

		public static int[] state = new int[2];
		public static int[] eg = new int[2];
		public static int[] stateNext = new int[2];
		public static double[] Qmem = new double[2];

		static void Main(string[] args)
		{
			QClear();
			Console.WriteLine("Q vs Q");
			AIstart(-1);
		}

		static void AIstart(int mode)
		{
			for (int i = 0; i < episode; i++)
			{
				boardClear();
				AIGame(mode);
			}
			Console.WriteLine(win1);
			Console.WriteLine(win2);
			Console.WriteLine(draw);
		}

		public static int win1 = 0;
		public static int win2 = 0;
		public static int draw = 0;
		private static void AIGame(int mode)
		{
			int Qnum = 0;
			int egNum;
			while (true)
			{
				state[Qnum] = getState();
				eg[Qnum] = epsilonGreedy(Qnum, mode);
				board[eg[Qnum]] = Qnum + 1;

				stateNext[Qnum] = getState();
				egNum = endGame(Qnum);
				if (egNum != 0)
				{
					break;
				}
				Qmem[Qnum] = Q[Qnum][state[Qnum]][eg[Qnum]];
				QCalculation(Qnum, 0);
				Qnum = (Qnum == 0) ? 1 : 0;
				// break;
			}

			int s = 0;
			switch (egNum)
			{
				case 1: win1++; s = score; break;
				case 2: win2++; s = score; break;
				case 3: draw++; s = 0; break;
			}
			QCalculation(Qnum, s);
			Qnum = (Qnum == 0) ? 1 : 0;
			Q[Qnum][state[Qnum]][eg[Qnum]] = Qmem[Qnum];
			QCalculation(Qnum, -s);
		}
		private static void QCalculation(int q, int i)
		{
			Q[q][state[q]][eg[q]] = (1 - alpha) * Q[q][state[q]][eg[q]] + alpha * (i + gamma * maxValue(q, stateNext[q]));
		}

		private static double maxValue(int q, int n)
		{

			double max = -score * 100;
			for (int i = 0; i < Q[q][n].Length; i++)
			{
				if (Q[q][n][i] > max)
				{
					max = Q[q][n][i];
				}
			}
			return max;
		}

		private static int endGame(int q)
		{
			int end = 0;
			if (board[0] == board[1] && board[0] == board[2] && board[0] != 0) end = q + 1;
			if (board[3] == board[4] && board[3] == board[5] && board[3] != 0) end = q + 1;
			if (board[6] == board[7] && board[6] == board[8] && board[6] != 0) end = q + 1;
			if (board[0] == board[3] && board[0] == board[6] && board[0] != 0) end = q + 1;
			if (board[1] == board[4] && board[1] == board[7] && board[1] != 0) end = q + 1;
			if (board[2] == board[5] && board[2] == board[8] && board[2] != 0) end = q + 1;
			if (board[0] == board[4] && board[0] == board[8] && board[0] != 0) end = q + 1;
			if (board[2] == board[4] && board[2] == board[6] && board[2] != 0) end = q + 1;

			// foreach(int i in board){
			// 	Console.WriteLine(i);
			// }

			if (end == 0)
			{
				end = 3;
				for (int i = 0; i < board.Length; i++)
				{
					if (board[i] == 0)
					{
						end = 0;
						break;
					}
				}
			}
			return end;
		}

		private static int epsilonGreedy(int qnum, int mode)
		{
			var rand = new Random();
			int[] ssArr = searchStone();
			int r = 0;
			if (mode == -1)
			{
				if (rand.Next(100) < epsilon * 100)
				{
					//Console.Write(1);
					r = ssArr[rand.Next(ssArr.Length)];
				}
				else
				{
					//Console.Write(2);
					r = eGreedy(qnum, ssArr);
				}
			}
			return r;
		}

		private static int eGreedy(int q, int[] s)
		{
			double ans = score * -100;
			int r = 0;
			for (int i = 0; i < s.Length; i++)
			{
				if (ans < Q[q][state[q]][s[i]])
				{
					ans = Q[q][state[q]][s[i]];
					r = s[i];
				}
			}
			return r;
		}

		private static int[] searchStone()
		{
			int[] rArr = new int[0];
			for (int i = 0; i < 9; i++)
			{
				if (board[i] == 0)
				{
					Array.Resize(ref rArr, rArr.Length + 1);
					rArr[rArr.Length - 1] = i;
				}
			}
			return rArr;
		}

		private static int getState()
		{
			int r = 0;
			for (int i = 0; i < board.Length; i++)
			{
				r += (int)Math.Pow(3, i) * board[i];
			}
			return r;
		}

		private static void boardClear()
		{
			Array.Clear(board, 0, board.Length);
		}

		public static void QClear()
		{
			int p = (int)Math.Pow(3, 3 * 3);
			int q = (int)Math.Pow(3, 2);
			for (int qN = 0; qN < Q.Length; qN++)
			{
				Q[qN] = new double[p][];
				for (int rN = 0; rN < Q[qN].Length; rN++)
				{
					Q[qN][rN] = new double[q];
				}
			}
		}
	}
}
