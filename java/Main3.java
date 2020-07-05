import java.util.Arrays;
import java.util.Random;
import java.util.Scanner;

public class Main {
	static double[][] Q = new double[19683][9];
    static double alpha = 0.2; 			//学習係数
    static double gamma = 0.9;			 //割引率
    static double epsilon = 0.05; 			//グリーディのやつ
    
	public static void main(String[] args) {
		Random rand = new Random();
		Scanner scan = new Scanner(System.in);
		int win1 = 0;
		int win2 = 0;
		int drawCount = 0;
		System.out.print("何回対戦させますか？：");
		int n = scan.nextInt();
		int s1; 					//状態1
        int s2; 					//状態2
        int a;  					//行動
        double r = 0;  	 //報酬
        double maxQ = 0;
		
		for(int times = 0; times < n; times++) {	//times回勝負
			String[] array = {"□", "□", "□", "□", "□", "□", "□", "□", "□"};
			int drawJudge = 0;
			r = 0;
			s1 = 0;
			for(;;) {		//9マス埋まるまで
				a = 0;				
				//CPU1の番
				while(array[a] != "□") {
					a = rand.nextInt(9);
				}
				s1 = getState(array);
				array[a] = "〇";
				drawJudge++;
			
				//勝利判定
				if(array[0] == "〇" && array[1] == "〇" && array[2] == "〇") {
					win1++;
					r = -1;
				}else if(array[3] == "〇" && array[4] == "〇" && array[5] == "〇") {
					win1++;
					r = -1;
				}else if(array[6] == "〇" && array[7] == "〇" && array[8] == "〇") {
					win1++;
					r = -1;
				}else if(array[0] == "〇" && array[3] == "〇" && array[6] == "〇") {
					win1++;
					r = -1;
				}else if(array[1] == "〇" && array[4] == "〇" && array[7] == "〇") {
					win1++;
					r = -1;
				}else if(array[2] == "〇" && array[5] == "〇" && array[8] == "〇") {
					win1++;
					r = -1;
				}else if(array[0] == "〇" && array[4] == "〇" && array[8] == "〇") {
					win1++;
					r = -1;
				}else if(array[2] == "〇" && array[4] == "〇" && array[6] == "〇") {
					win1++;
					r = -1;
				}
				s2 = getState(array);
				Q[s1][a] = max(s1, a, s2, r);
				
				if(r != 0) {
					break;
				}
				if(drawJudge == 9) {
					drawCount++;
					r = 0;
					break;
				}
			
				//CPU2の番
					do {
						double z = rand.nextDouble();
						s1 = getState(array);
						if(z < epsilon) {
							a = rand.nextInt(9);
						}else {
							a = 8;
							maxQ = Q[s1][8];
							for(int i = 0; i < 8; i++) {
								if(maxQ < Q[s1][i]) {
									a = i;
								maxQ = Q[s1][i];
								}
							}
						}
					}while(array[a] != "□");
				s1 = getState(array);
				array[a] = "×";			
				drawJudge++;
				//勝利判定
				if(array[0] == "×" && array[1] == "×" && array[2] == "×") {
					win2++;
					r = 1;
				}else if(array[3] == "×" && array[4] == "×" && array[5] == "×") {
					win2++;
					r = 1;
				}else if(array[6] == "×" && array[7] == "×" && array[8] == "×") {
					win2++;
					r = 1;
				}else if(array[0] == "×" && array[3] == "×" && array[6] == "×") {
					win2++;
					r = 1;
				}else if(array[1] == "×" && array[4] == "×" && array[7] == "×") {
					win2++;
					r = 1;
				}else if(array[2] == "×" && array[5] == "×" && array[8] == "×") {
					win2++;
					r = 1;
				}else if(array[0] == "×" && array[4] == "×" && array[8] == "×") {
					win2++;
					r = 1;
				}else if(array[2] == "×" && array[4] == "×" && array[6] == "×") {
					win2++;
					r = 1;
				}
				s2 = getState(array);
				if(r != 0) {
					Q[s1][a] = min(s1, a, s2, r);	
					s1 = 0;
					s2 = 0;
					break;
				}
			}
		}
		System.out.println("CPU1(random)：" + win1);
		System.out.println("CPU2(QL)：" + win2);
		System.out.println("引き分け数：" + drawCount);
	}
	
	private static int getState(String[] array) {
		int state = 0;
		int tmp = 0;
		for(int i = 0; i < 9; i++) {
			if(array[i] == ("〇")) {
				tmp = 1;
			}
			else if(array[i] == ("×")) {
				tmp = 2;
			}
			else if(array[i] == ("□")) {
				tmp = 0;
			}
			state += Math.pow(3, i) * tmp;
		}
		return state;
	}
	
	static double min(int s1, int a, int s2, double r) {
		double minQs = Arrays.stream(Q[s2]).min().getAsDouble(); 
        double qValue = Q[s1][a] + alpha * (r + gamma * minQs - Q[s1][a]);
        return qValue;
    }
	
	static double max(int s1, int a, int s2, double r) {
		double minQs = Arrays.stream(Q[s2]).max().getAsDouble(); 
        double qValue = Q[s1][a] + alpha * (r + gamma * minQs - Q[s1][a]);
        return qValue;
    }
}
