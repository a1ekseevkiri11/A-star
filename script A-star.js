const starting_flag_color = "green";
const finish_flag_color = "red";
const path_color = "blue";
const obstacle_color = "black";
const matrix_color = "white";
const motion_animation_color = "Gray";
const passed_cells_color = "#cdcdcd";


const canvas = document.querySelector("canvas");
const plane = canvas.getContext("2d");
const size_matrix = 800;


let n;
let cell_size;//размер ячейки(клеточки)
let matrix;
let start = [-1, -1];
let finish = [-1, -1];

function createMap(){
    n = document.getElementById("input").value;
    if(n < 2 | n > 30 | !n){
        alert("Введите число от 2 до 30")
        return;
    }
    matrix = getMatrix(0);
    plane.clearRect(0, 0, size_matrix, size_matrix);
    plane.beginPath();
    cell_size = size_matrix / n;
    let x = 0;
    let y = 0;
    for (let i = 0; i <= n; i++){
        plane.moveTo(x, 0);
        plane.lineTo(x, cell_size * n);
        x += cell_size;
    }

    for (let i = 0; i <= n; i++){
        plane.moveTo(0, y);
        plane.lineTo(cell_size * n, y);
        y += cell_size;
    }

    plane.stroke();
    canvas.addEventListener("click", Click);

    document.getElementById("walls").onclick = function(){oper = 0;};
    document.getElementById("start").onclick = function(){oper = 1;};
    document.getElementById("finish").onclick = function(){oper = 2;};
}

function getMatrix(count) {
    let matrix = new Array(n);
    for (let i = 0; i < n; i++)
    {
        matrix[i] = new Array(n);
        for (let j = 0; j < n; j++)
        {
            matrix[i][j] = count;
        }
    }
    return matrix;
}

function Click(event){
    let RightX = event.pageX - event.target.offsetLeft;//относительные координаты
    let RightY = event.pageY - event.target.offsetTop;
    //j - это x ,а i - y, потому что в канвас координаты такие:https://msiter.ru/tutorials/html5-canvas/coordinates
    let j = Math.floor(RightX / cell_size);
    let i = Math.floor(RightY / cell_size);
    let cellX = j * cell_size;
    let cellY = i * cell_size;
    switch(oper){
        case 0:
            if (start[0] === i && start[1] === j){
                start = [-1, -1];
            }
            if (finish[0] === i && finish[1] === j){
                finish = [-1, -1];
            }
            if (matrix[i][j]){
                matrix[i][j] = 0;
                plane.fillStyle = matrix_color;
                plane.fillRect(cellX + 0.5 , cellY + 0.5, cell_size - 1, cell_size - 1);
            }
            else{
                matrix[i][j] = 1;
                plane.fillStyle = obstacle_color;
                plane.fillRect(cellX, cellY, cell_size, cell_size);
            }
            break;

        case 1:
            if (matrix[i][j]){
                matrix[i][j] = 0;
                plane.fillStyle=matrix_color;
                plane.fillRect(CellX * cell_size + 0.5, CellY * cell_size + 0.5, cell_size - 1, cell_size - 1);
            }
            if (JSON.stringify(start) !== JSON.stringify([-1, -1])){
                plane.fillStyle=matrix_color;
                plane.fillRect(start[1] * cell_size + 0.5, start[0] * cell_size + 0.5, cell_size - 1, cell_size - 1);
            }
            if (JSON.stringify([i, j]) === JSON.stringify(finish)){
                plane.fillStyle=matrix_color;
                plane.fillRect(finish[1] * cell_size + 0.5, finish[0] * cell_size + 0.5, cell_size - 1, cell_size - 1);
                finish = [-1, -1];
            }
            plane.fillStyle=starting_flag_color;
            plane.fillRect(cellX + 0.5, cellY + 0.5, cell_size - 1, cell_size - 1);
            start[0] = i;
            start[1] = j;
            break;

        case 2:
            if (matrix[i][j]){
                matrix[i][j] = 0;
                plane.fillStyle = matrix_color;
                plane.fillRect(cellX + 0.5 , cellY + 0.5, cell_size - 1, cell_size - 1);
            }
            if (JSON.stringify([i, j]) === JSON.stringify(start)){
                plane.fillStyle=matrix_color;
                plane.fillRect(start[1] * cell_size + 0.5, start[0] * cell_size * cell_size + 0.5, cell_size - 1, cell_size - 1);
                start = [-1, -1];
            }
            if (JSON.stringify(finish) !== JSON.stringify([-1, -1])){
                plane.fillStyle=matrix_color;
                plane.fillRect(finish[1] * cell_size + 0.5, finish[0] * cell_size + 0.5, cell_size - 1, cell_size - 1);
            }

            plane.fillStyle=finish_flag_color;
            plane.fillRect(cellX + 0.5, cellY + 0.5, cell_size - 1, cell_size - 1);
            finish[0] = i;
            finish[1] = j;
            break;
    }
}

function Queue(){
    let Set = [];
    //Добавляем ячейку и расстояние
    this.addTo = function(cell) {
        if (this.isEmpty()) {
            Set.push(cell);
        }
        else {
            let fl = false;
            for (let i = 0; i < Set.length; i++) {
                if (cell[1] < Set[i][1])
                {
                    Set.splice(i, 0, cell);
                    fl = true;
                    break;
                }
            }
            if (!fl) {
                Set.push(cell);
            }
        }
    }

    this.takeFirst = function(){
        return Set.shift();
    }

    this.isEmpty = function(){
        return Set.length === 0;
    }
}

function heuristic(cur, finish){
    return  Math.max(Math.abs(finish[0] - cur[0]),Math.abs(finish[1] - cur[1]));
}

function getNeigbors(cur, matrix, G) {
    let neighbours = [];
    let x = cur[0][0];
    let y = cur[0][1];
    if(y != n - 1 && !matrix[x][y + 1] && G[x][y + 1] === -1){
        neighbours.push([x, y + 1]);
    }
    if(x != n - 1 && !matrix[x + 1][y] && G[x + 1][y] === -1){
        neighbours.push([x + 1, y]);
    }
    if(x != 0 && !matrix[x - 1][y] && G[x - 1][y] === -1){
        neighbours.push([x - 1, y]);
    }
    if(y != 0 && !matrix[x][y - 1] && G[x][y - 1] === -1){
        neighbours.push([x, y - 1]);
    }
    if(x > 0 && y > 0 && !matrix[x - 1][y - 1] && G[x - 1][y - 1] === -1){
        neighbours.push([x - 1, y - 1]);
    }
    if(x < n - 1 && y < n - 1 && !matrix[x + 1][y + 1] && G[x + 1][y + 1] === -1){
        neighbours.push([x + 1, y + 1]);
    }
    if(x > 0 && y < n - 1 && !matrix[x - 1][y + 1] && G[x - 1][y + 1] === -1){
        neighbours.push([x - 1, y + 1]);
    }
    if(x < n - 1 && y > 0 && !matrix[x + 1][y - 1] && G[x + 1][y - 1] === -1){
        neighbours.push([x + 1, y - 1]);
    }
    return neighbours;
}

//стрелочная функция ожидания
async function wait() {
    return new Promise(resolve => setTimeout(resolve, 200));
}

async function aStar(start, finish) {
    let queue = new Queue();
    let GScores = getMatrix(-1);
    GScores[start[0]][start[1]] = 0;
    let parents = [];//массив родителей(для окраски самого короткого пути)
    for (let i = 0; i < n; i++){
        parents[i] = new Array(n)
        for (let j = 0; j < n; j++){
            parents[i][j] = new Array(2);
            parents[i][j][0] = -1;//координаты, дочерней клетки
            parents[i][j][1] = -1;
        }
    }
    queue.addTo([start, heuristic(start, finish)]);
    while(!queue.isEmpty()){
        let current = queue.takeFirst();
        if (current[0][0] === finish[0] && current[0][1] === finish[1]){
            break;
        }
        let neighbours = getNeigbors(current, matrix, GScores);
        for (let i = 0; i < neighbours.length; i++){
            let neigbor = neighbours[i];
            plane.fillStyle = motion_animation_color;
            plane.fillRect(neigbor[1] * cell_size + 1, neigbor[0] * cell_size + 1, cell_size - 1, cell_size - 1);
            await wait();
            plane.fillStyle = passed_cells_color;
            plane.fillRect(neigbor[1] * cell_size + 1, neigbor[0] * cell_size + 1, cell_size - 1, cell_size - 1);
            let nX = neigbor[0];
            let nY = neigbor[1];
            let cX = current[0][0];
            let cY = current[0][1];
            if (GScores[nX, nY] === -1 || GScores[cX][cY] + 1 > GScores[nX][nY]){
                parents[nX][nY][0] = cX;
                parents[nX][nY][1] = cY;
                GScores[nX][nY] = GScores[cX][cY] + 1;
                queue.addTo([neigbor, GScores[nX][nY] + heuristic(neigbor, finish)]);
            }
        }
    }
    plane.fillStyle = finish_flag_color;
    plane.fillRect(finish[1] * cell_size, finish[0] * cell_size, cell_size - 1, cell_size - 1);

    if (JSON.stringify(parents[finish[0]][finish[1]]) !== JSON.stringify([-1, -1])){
        let cell = parents[finish[0]][finish[1]];
        while (cell[0] !== -1 && cell[1] !== -1){
            plane.fillStyle = path_color;
            plane.fillRect(cell[1] * cell_size + 1, cell[0] * cell_size + 1, cell_size - 1, cell_size - 1);
            cell = parents[cell[0]][cell[1]];
        }
        plane.fillStyle = starting_flag_color;
        plane.fillRect(start[1] * cell_size, start[0] * cell_size, cell_size - 1, cell_size - 1);
    }

    else{
        alert("Пути нет!");
    }
}