class dijkstra {
   buildWeightMap(g, startPoint) {
    const visitedNode = new Array(g.length).fill(0);
    const weightsMap = new Array(g.length).fill(Infinity);
    weightsMap[startPoint] = 0;
    let currentNode = startPoint;
    let counterForward = +1;
    while (visitedNode.indexOf(0) > -1) {
      for (let j in g[currentNode]) {
        if (
          visitedNode[j] ||
          g[currentNode][j] + weightsMap[currentNode] > weightsMap[j] ||
          g[currentNode][j] === 0
        ) {
          continue;
        }
        weightsMap[j] = g[currentNode][j] + weightsMap[currentNode];
      }
      visitedNode[currentNode] = 1;
      currentNode += counterForward;
      if (currentNode >= g.length) {
        currentNode = startPoint;
        counterForward = -1;
      }
    }
    return weightsMap;
  }
}

export default new dijkstra();