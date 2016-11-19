/**
* This assignment was to implement a MinHeap in Java that allows a user
* to insert or remove elements in logn time.
*/

package heaps;

import java.util.Random;
import java.util.UUID;

import javax.swing.JOptionPane;

import heaps.util.HeapToStrings;
import heaps.validate.MinHeapValidator;
import timing.Ticker;

public class MinHeap<T extends Comparable<T>> implements PriorityQueue<T> {

	private Decreaser<T>[] array;
	private int size;
	private final Ticker ticker;

	@SuppressWarnings("unchecked")
	public MinHeap(int maxSize, Ticker ticker) {
		this.array = new Decreaser[maxSize+1];
		this.size = 0;
		this.ticker = ticker;
	}

	public Decreaser<T> insert(T thing) {

		Decreaser<T> ans = new Decreaser<T>(thing, this, ++size);

		array[size] = ans;
		decrease(ans.loc);
		ticker.tick(2);
		return ans;
	}

	void decrease(int loc) {
		int parentRef = loc/2;
		ticker.tick();
		
		if (loc > 1) {
			if (array[loc].getValue().compareTo(array[parentRef].getValue()) < 0) {
				moveItem(loc, parentRef);
				ticker.tick();
				decrease(parentRef);
				ticker.tick();
			}
		}
	}
	
	void moveItem(int from, int to) {
		Decreaser<T> child = array[from];
		Decreaser<T> parent = array[to];
		
		//Swap objects
		array[to] = child;
		ticker.tick(1000);
		array[from] = parent;
		ticker.tick(1000);
		
		//Swap locations
		array[to].loc = to;
		ticker.tick(1000);
		array[from].loc = from; 
		ticker.tick(1000);
	}
	
	public T extractMin() {
		T ans = array[1].getValue();
		Decreaser<T> last = array[size];
		array[1] = last;
		array[1].loc = 1;
		array[size] = null;
		size = size - 1;
		ticker.tick(5);
		heapify(1);
		ticker.tick();
		
		return ans;
	}


	private void heapify(int where) {
		
		if (where*2 <= size) {
			if (array[where*2 + 1] != null) {
				if (array[where*2].getValue().compareTo(array[where*2+1].getValue()) < 0) {
					if (array[where*2].getValue().compareTo(array[where].getValue()) < 0) {
						moveItem(where*2, where);
						ticker.tick();
						heapify(where*2);
						ticker.tick();
					}
				}
				else {
					if (array[where*2+1].getValue().compareTo(array[where].getValue()) < 0) {
						moveItem(where*2+1, where);
						ticker.tick();
						heapify(where*2+1);
						ticker.tick();
					}
				}
			} else if (array[where*2] != null) {
				if (array[where*2].getValue().compareTo(array[where].getValue()) < 0) {
					moveItem(where*2, where);
					ticker.tick();
					heapify(where*2);
					ticker.tick();
				}
			}
		}
	}
	
	public boolean isEmpty() {
		return size == 0;
	}

	/**
	 * This method would normally not be present, but it allows
	 *   our consistency checkers to see if your heap is in good shape.
	 * @param loc the location
	 * @return the value currently stored at the location
	 */
	public T peek(int loc) {
		if (array[loc] == null)
			return null;
		else return array[loc].getValue();
	}

	/**
	 * Return the loc information from the Decreaser stored at loc.  They
	 *   should agree.  This method is used by the heap validator.
	 * @param loc
	 * @return the Decreaser's view of where it is stored
	 */
	public int getLoc(int loc) {
		return array[loc].loc;
	}

	public int size() {
		return this.size;
	}
	
	public int capacity() {
		return this.array.length-1;
	}
	

	/**
	 * The commented out code shows you the contents of the array,
	 *   but the call to HeapToStrings.toTree(this) makes a much nicer
	 *   output.
	 */
	public String toString() {
//		String ans = "";
//		for (int i=1; i <= size; ++i) {
//			ans = ans + i + " " + array[i] + "\n";
//		}
//		return ans;
		return HeapToStrings.toTree(this);
	}

	/**
	 * This is not the unit test, but you can run this as a Java Application
	 * and it will insert and extract 100 elements into the heap, printing
	 * the heap each time it inserts.
	 * @param args
	 */
	public static void main(String[] args) {
		JOptionPane.showMessageDialog(null, "You are welcome to run this, but be sure also to run the TestMinHeap JUnit test");
		MinHeap<Integer> h = new MinHeap<Integer>(500, new Ticker());
		MinHeapValidator<Integer> v = new MinHeapValidator<Integer>(h);
		Random r = new Random();
		for (int i=0; i < 100; ++i) {
			v.check();
			h.insert(r.nextInt(1000));
			v.check();
			System.out.println(HeapToStrings.toTree(h));
			//System.out.println("heap is " + h);
		}
		while (!h.isEmpty()) {
			int next = h.extractMin();
			System.out.println("Got " + next);
		}
	}


}
