const matrix_color = "white";
const pen_color = "darkorange";

function createTable() {
  document.getElementById("createMatrix").addEventListener("click", createMatrix);
  document.getElementById("clearTable").addEventListener("click", clearTable); 
  let container = document.getElementById("table-container");
  let table = document.createElement("table");
  for (let i = 0; i < 5; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 5; j++){
      let cell = document.createElement("td");
      cell.style.backgroundColor = matrix_color;
      cell.addEventListener("click", function() {
        let color = this.style.backgroundColor;
        if(color === matrix_color){
          cell.style.backgroundColor = pen_color;
        }
        else {
          cell.style.backgroundColor = matrix_color;
        }
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.innerHTML = "";
  container.appendChild(table);
  
}

function createMatrix(){
  let matrix = [];
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < 5; i++){
    for(let j = 0; j < 5; j++){
      if (table.rows[i].cells[j].style.backgroundColor === pen_color){
        matrix[i * 5 + j] = 1;
      }
      else{
        matrix[i * 5 + j] = 0;
      }
    }
  }
  matrix = getFeedForward(matrix);
  let max_indx = 0;
  let max_number = 0;
  for(let i = 0; i < matrix.length; i++){
    if(matrix[i] > max_number){
      max_number = matrix[i];
      max_indx = i;
    }
  }
  alert("Это цифра - " + max_indx + " с вероятностью " + max_number.toFixed(2) * 100 + "%");
}

function clearTable(){
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++){
      table.rows[i].cells[j].style.backgroundColor = matrix_color;
    }
  }
  container.innerHTML = "";
  container.appendChild(table);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp( -x ));
}

function getMultiplicationMatrix(a, b) {
  let result = Array(a[0].length);
  for (let i = 0; i < a[0].length; i++) {
      let sum = 0;
      for (let j = 0; j < a.length; j++) {
          sum += a[j][i] * b[j];
      }
      result[i] = sigmoid(sum);
  }
  return result;
}

function getFeedForward(matrix) {
  for (let k = 0; k < weight.length; k++) {
    matrix = getMultiplicationMatrix(weight[k], matrix);
  }
  return matrix;
}