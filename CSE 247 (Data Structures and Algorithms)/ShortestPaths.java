/**
* This assignment was to implement Dijkstra's shortest path 
* algorithm in Java, which finds the shortest path in a directed 
* graph in nlogn time.
*/

package spath;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import heaps.Decreaser;
import heaps.MinHeap;
import spath.graphs.DirectedGraph;
import spath.graphs.Edge;
import spath.graphs.Vertex;
import timing.Ticker;
import spath.VertexAndDist;



public class ShortestPaths {
	private final static Integer inf = Integer.MAX_VALUE;
	private HashMap<Vertex, Decreaser<VertexAndDist>> map;
	private HashMap<Vertex, Edge> toEdge;
	private Map<Edge, Integer> weights;
	private Vertex startVertex;
	private final DirectedGraph g;
	

	public ShortestPaths(DirectedGraph g, Vertex startVertex, Map<Edge,Integer> weights) {

		this.map         = new HashMap<Vertex, Decreaser<VertexAndDist>>();
		this.toEdge      = new HashMap<Vertex, Edge>();
		this.weights     = weights;
		this.startVertex = startVertex;
		this.g           = g;
	}

	public void run() {
		Ticker ticker = new Ticker();
		MinHeap<VertexAndDist> pq = new MinHeap<VertexAndDist>(30000, ticker);


		
		for (Vertex v : g.vertices()) {
			toEdge.put(v, null);
			VertexAndDist a = new VertexAndDist(v, inf);
			Decreaser<VertexAndDist> d = pq.insert(a);
			map.put(v, d);
			ticker.tick();
		}


		Decreaser<VertexAndDist> startVertDist = map.get(startVertex);

		startVertDist.decrease(startVertDist.getValue().sameVertexNewDistance(0));


		while (pq.size() > 0) {
			ticker.tick();
			//saves VertexAndDist object that is extracted
			VertexAndDist x = pq.extractMin();
			//saves vertex and distance of extracted node
			Vertex vert = x.getVertex();
			int dist = x.getDistance();
			ticker.tick();
			//iterates through edges from vert
			for (Edge e : vert.edgesFrom()) {
				ticker.tick();
				//vertTo = vertex where the edge points
				Vertex vertTo = e.to;
				//gets previous distance of vertTo
				int vertToDist = map.get(vertTo).getValue().getDistance();
				//finds distance of extracted node plus weight of current edge being iterated
				int sum = dist + weights.get(e);
				ticker.tick();
				//if sum is smaller, replaces the vertex's distance and edge distance in the map
				if (sum < vertToDist) {
					Decreaser<VertexAndDist> temp = map.get(vertTo);
					temp.decrease(temp.getValue().sameVertexNewDistance(sum));
					toEdge.put(vertTo, e);
					ticker.tick();
				}
			}
		}
	}

	
	/**
	 * Return a List of Edges forming a shortest path from the
	 *    startVertex to the specified endVertex.  Do this by tracing
	 *    backwards from the endVertex, using the map you maintain
	 *    during the shortest path algorithm that indicates which
	 *    Edge is used to reach a Vertex on a shortest path from the
	 *    startVertex.
	 * @param endVertex 
	 * @return
	 */
	public LinkedList<Edge> returnPath(Vertex endVertex) {
		LinkedList<Edge> path = new LinkedList<Edge>();
		Vertex next = endVertex;
		Edge e = toEdge.get(endVertex);
		while (e.from != startVertex) {
			e = toEdge.get(next);
			path.addFirst(e);
			next = e.from;	
		}
		return path;
	}
	
	/**
	 * Return the length of all shortest paths.  This method
	 *    is completed for you, using your solution to returnPath.
	 * @param endVertex
	 * @return
	 */
	public int returnValue(Vertex endVertex) {
		LinkedList<Edge> path = returnPath(endVertex);
		int pathValue = 0;
		for(Edge e : path) {
			pathValue += weights.get(e);
		}
		
		return pathValue;
		
	}
}
