/**
* This assignment was to implement a version of merge sort,
* a divide and conquer algorithm, that could divide the input 
* into any number of pieces K and sort each of the K pieces recursively
* in nlogn time.
*/


package kwaymergesort;

import timing.Ticker;

public class KWayMergeSort {
	
	/**
	 * 
	 * @param K some positive power of 2.
	 * @param input an array of unsorted integers.  Its size is either 1, or some other power of 2 that is at least K
	 * @param ticker call .tick() on this to account for the work you do
	 * @return
	 */
	public static Integer[] kwaymergesort(int K, Integer[] input, Ticker ticker) {
		int n = input.length;
		Integer[] ans = new Integer[n];

		
		
		//if size of input is 1, return the input
		if (n==1) {
			ans = input;
			ticker.tick();
		}
		//otherwise, make a matrix of K x (n/K) with all the values copied in
		else {
			Integer[][] pieces = new Integer[K][n/K];		
			for (int outer = 0; outer < K; outer ++) {
				System.arraycopy(input, (outer*(n/K)), pieces[outer], 0, (n/K));
				ticker.tick();
			}
			
			//sort each of the arrays in the matrix recursively 
			for (int x = 0; x < K; x++) {
				pieces[x] = kwaymergesort(K, pieces[x], ticker);
				ticker.tick();
			}
			
			//merge each of the pieces with the one next to it
			//until only one piece remains
			int kCount = K;
			while (kCount > 1) {
				for (int r = 0; r < kCount; r += 2) {
					pieces[r/2] = merge(pieces[r], pieces[r+1], ticker);
					ticker.tick();
				}
				kCount = kCount / 2;
			}
			//return that piece
			ans = pieces[0];
		}
		
		return ans;
	}
	
	public static Integer[] merge(Integer[] one, Integer[] two, Ticker ticker) {
		int countOne = 0;
		int countTwo = 0;
		Integer[] ans = new Integer[(one.length + two.length)];
		
		//while still in array, put next smallest value into next spot in the array
		while(countOne < one.length || countTwo < two.length) {
			//if array one is exhausted
			if (countOne == one.length) {
				ticker.tick();
				ans[countOne + countTwo] = two[countTwo];
				countTwo++;
			}
			//if array two is exhausted
			else if (countTwo == two.length) {
				ticker.tick();
				ans[countOne + countTwo] = one[countOne];
				countOne++;
			}
			//if both still have values, compare and insert the lesser
			else {
				if (one[countOne] < two[countTwo]) {
					ticker.tick();
					ans[countOne + countTwo] = one[countOne];
					countOne++;
				}
				else {
					ticker.tick();
					ans[countOne + countTwo] = two[countTwo];
					countTwo++;
				}
			}
			ticker.tick();
		}
		
		return ans;
	}

}
