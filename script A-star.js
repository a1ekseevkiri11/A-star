//n - размер матрицы

const starting_flag_color = "green";
const finish_flag_color = "red";
const path_color = "blue";
const obstacle_color = "black";
const matrix_color = "white";


let color_flag = obstacle_color;
let starting_flag = false, finish_flag = false, diagonal = true;
let start_coordinates = null, finish_coordinates = null;

class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function operationLet(){
  color_flag = obstacle_color;
}

function operationStart(){
  color_flag = starting_flag_color;
}

function operationFinish(){
  color_flag = finish_flag_color;
}

function getColor(color) {
  if(color === finish_flag_color){
    finish_flag = false;
    return matrix_color;
  }
  if(color === starting_flag_color){
    starting_flag = false;
    return matrix_color;
  }
  if(color_flag === finish_flag_color && finish_flag === false){
    finish_flag = true;
    return color_flag;
  }
  if(color_flag === starting_flag_color && starting_flag === false){
    starting_flag = true;
    return color_flag;
  }
  if(color !== obstacle_color && color_flag === obstacle_color){
    return color_flag;
  }
  return matrix_color;
}

function createTable() {
  starting_flag = false, finish_flag = false;
  let n = document.getElementById("input").value;
  if(n < 2 | n > 50 | !n){
    alert("Введите число от 2 до 50")
    return;
  }
  let container = document.getElementById("table-container");
  let table = document.createElement("table");
  for (let i = 0; i < n; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < n; j++){
      let cell = document.createElement("td");
      cell.style.backgroundColor = matrix_color;
      cell.addEventListener("click", function() {
        let color = this.style.backgroundColor;
        cell.style.backgroundColor = getColor(color);
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.innerHTML = "";
  container.appendChild(table);
}


function createMatrix(){
  let n = document.getElementById("input").value;
  let matrix = [];
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < n; i++){
    let row = [];
    for(let j = 0; j < n; j++){
      if(table.rows[i].cells[j].style.backgroundColor === starting_flag_color){
        start_coordinates = new Coordinates(i, j);
      }
      if(table.rows[i].cells[j].style.backgroundColor === finish_flag_color){
        finish_coordinates = new Coordinates(i, j);
      }
      if (table.rows[i].cells[j].style.backgroundColor !== obstacle_color){
        row[j] = 1;
      }
      else{
        row[j] = 0;
      }
    }
    matrix[i] = row;
  }
  return matrix;
}

function clearTheMatrixOfPaths(){
  start_coordinates = null, finish_coordinates = null;
  let n = document.getElementById("input").value;
  let container = document.getElementById("table-container");
  if (!container){
    return;
  }
  let table = container.querySelector("table");
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++){
      if(table.rows[i].cells[j].style.backgroundColor === path_color){
        table.rows[i].cells[j].style.backgroundColor = matrix_color;
      }
    }
  }
  container.innerHTML = "";
  container.appendChild(table);
}

function findAWay(){
  clearTheMatrixOfPaths();
  let matrix = createMatrix();
  if (!matrix || !start_coordinates || !finish_coordinates){
    alert("Введите ВСЕ значения!")
    return;
  }
  let graph = new Graph(matrix);
  let start = graph.grid[start_coordinates.x][start_coordinates.y];
  let end = graph.grid[finish_coordinates.x][finish_coordinates.y];
  let result = aStar.search(graph, start, end);
  if(result.length === 0){
    alert("Пути нет!");
    return;
  }
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < result.length - 1; i++){
    table.rows[result[i].x].cells[result[i].y].style.backgroundColor = path_color;
  }
  container.innerHTML = "";
  container.appendChild(table);
}

(function(definition) {
  let exports = definition();
  aStar = exports.aStar;
  Graph = exports.Graph;
})
(function() {
function pathTo(node) {
  let curr = node;
  let path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}
function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}
let aStar = {
  //метод search возвращает самый короткий путь
  search: 
  function(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    let heuristic = options.heuristic || aStar.heuristics.manhattan;
    let closest = options.closest || false;
    let openHeap = getHeap();
    let closestNode = start; 
    start.h = heuristic(start, end);
    graph.markDirty(start);
    openHeap.push(start);
    while (openHeap.size() > 0) {
      let currentNode = openHeap.pop();
      if (currentNode === end) {
        return pathTo(currentNode);
      }
      currentNode.closed = true;
      let neighbors = graph.neighbors(currentNode);
      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];
        if (neighbor.closed || neighbor.isWall()) {
          continue;
        }
        let gScore = currentNode.g + neighbor.getCost(currentNode);
        let beenVisited = neighbor.visited;
        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }
          if (!beenVisited) {
            openHeap.push(neighbor);
          } 
          else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }
    if (closest) {
      return pathTo(closestNode);
    }
    return [];
  },
  heuristics: {
    manhattan: function(pos0, pos1) {
      let d1 = Math.abs(pos1.x - pos0.x);
      let d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};
function Graph(gridIn, options) {
  options = options || {};
  this.nodes = [];
  this.diagonal = !!options.diagonal;
  this.grid = [];
  for (let x = 0; x < gridIn.length; x++) {
    this.grid[x] = [];
    for (let y = 0, row = gridIn[x]; y < row.length; y++) {
      let node = new GridNode(x, y, row[y]);
      this.grid[x][y] = node;
      this.nodes.push(node);
    }
  }
  this.init();
}
Graph.prototype.init = function() {
  this.dirtyNodes = [];
  for (let i = 0; i < this.nodes.length; i++) {
    aStar.cleanNode(this.nodes[i]);
  }
};
Graph.prototype.cleanDirty = function() {
  for (let i = 0; i < this.dirtyNodes.length; i++) {
    aStar.cleanNode(this.dirtyNodes[i]);
  }
  this.dirtyNodes = [];
};
Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node);
};
Graph.prototype.neighbors = function(node) {
  let return_neighbors = [];
  let x = node.x;
  let y = node.y;
  let grid = this.grid;
  if (grid[x - 1] && grid[x - 1][y]) {
    return_neighbors.push(grid[x - 1][y]);
  }
  if (grid[x + 1] && grid[x + 1][y]) {
    return_neighbors.push(grid[x + 1][y]);
  }
  if (grid[x] && grid[x][y - 1]) {
    return_neighbors.push(grid[x][y - 1]);
  }
  if (grid[x] && grid[x][y + 1]) {
    return_neighbors.push(grid[x][y + 1]);
  }
  if (diagonal) {
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      return_neighbors.push(grid[x - 1][y - 1]);
    }
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      return_neighbors.push(grid[x + 1][y - 1]);
    }
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      return_neighbors.push(grid[x - 1][y + 1]);
    }
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      return_neighbors.push(grid[x + 1][y + 1]);
    }
  }
  return return_neighbors;
};

function GridNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}
GridNode.prototype.getCost = function(fromNeighbor) {
  if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
    return this.weight * 1.41421;
  }
  return this.weight;
};
GridNode.prototype.isWall = function() {
  return this.weight === 0;
};
function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}
BinaryHeap.prototype = {
  push: function(element) {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    let result = this.content[0];
    let end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    let i = this.content.indexOf(node);
    let end = this.content.pop();
    if (i !== this.content.length - 1) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    let element = this.content[n];
    while (n > 0) {
      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);
    while (true) {
      let child2N = (n + 1) << 1;
      let child1N = child2N - 1;
      let swap = null;
      let child1Score;
      if (child1N < length) {
        let child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }
      if (child2N < length) {
        let child2 = this.content[child2N];
        let child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      else {
        break;
      }
    }
  }
};
return {
  aStar: aStar,
  Graph: Graph
};
});