const starting_flag_color = "green";
const finish_flag_color = "red";
const path_color = "blue";
const obstacle_color = "black";
const matrix_color = "white";
const motion_animation_color = "Gray";
const passed_cells_color = "DarkGray";

const canvas = document.querySelectorAll("canvas")[0];
const plane = canvas.getContext("2d");

const size_matrix = 800;

let n;//размер таблицы
let cell_size;//размер ячейки(клеточки)
let matrix;
let start = [-1, -1];
let finish = [-1, -1];

function drawACircle(x, y, color_flag){
    x *= cell_size;
    y *= cell_size;
    plane.beginPath();
    plane.arc(x + cell_size / 2, y + cell_size / 2, cell_size / 3 , 0, 2 * Math.PI);
    plane.fillStyle = color_flag;
    plane.fill();
    plane.stroke();
}

function fillInTheCell(x, y, color_flag){
    x *= cell_size;
    y *= cell_size;
    plane.fillStyle = color_flag;
    plane.fillRect(x + 1, y + 1, cell_size - 2, cell_size - 2);
}

function colorMap(){
    start = [-1, -1];
    finish = [-1, -1];
    for(let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            if(matrix[i][j] === 1){
                fillInTheCell(j, i, obstacle_color);
            }
            else{
                fillInTheCell(j, i, matrix_color);
            }
        }
    }
}

function createTableMarkup() {
    start = [-1, -1];
    finish = [-1, -1];
    matrix = getMatrix(0);
    plane.clearRect(0, 0, size_matrix, size_matrix);
    plane.beginPath();
    cell_size = size_matrix / n;
    let x = 0;
    let y = 0;
    for (let i = 0; i <= n; i++) {
        plane.moveTo(x, 0);
        plane.lineTo(x, cell_size * n);
        x += cell_size;
    }
    for (let i = 0; i <= n; i++) {
        plane.moveTo(0, y);
        plane.lineTo(cell_size * n, y);
        y += cell_size;
    }
    plane.stroke();
}

function clearMapOfPath(){
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            if (!matrix[i][j]){
                fillInTheCell(j, i, matrix_color);
            }
        }
    }
    drawACircle(start[1], start[0], starting_flag_color);
    drawACircle(finish[1], finish[0], finish_flag_color);
}

function createMap() {
    n = document.getElementById("input").value;
    if (n < 2 | n > 51 | !n) {
        alert("Введите число от 2 до 51")
        return;
    }
    createTableMarkup();
    canvas.addEventListener("click", Click);
    document.getElementById("obstacle").onclick = function () {
        oper = 'obstacle'; 
    };
    document.getElementById("start").onclick = function () {
        oper = 'start'; 
    };
    document.getElementById("finish").onclick = function () { 
        oper = 'finish'; 
    };
}

function getMatrix(count) {
    let matrix = [];
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            matrix[i][j] = count;
        }
    }
    return matrix;
}

function Click(event) {
    let RightX = event.pageX - event.target.offsetLeft;//относительные координаты
    let RightY = event.pageY - event.target.offsetTop;
    //j - это x ,а i - y, потому что в канвас координаты такие:https://msiter.ru/tutorials/html5-canvas/coordinates
    let j = Math.floor(RightX / cell_size);
    let i = Math.floor(RightY / cell_size);
    switch (oper) {
        case 'obstacle':
            if (start[0] === i && start[1] === j) {
                start = [-1, -1];
            }
            if (finish[0] === i && finish[1] === j) {
                finish = [-1, -1];
            }
            if (matrix[i][j]) {
                matrix[i][j] = 0;
                fillInTheCell(j, i, matrix_color);
            }
            else {
                matrix[i][j] = 1;
                fillInTheCell(j, i, obstacle_color);
            }
            break;

        case 'start':
            if (matrix[i][j]) {
                matrix[i][j] = 0;
                fillInTheCell(j, i, matrix_color);
            }
            if (JSON.stringify(start) !== JSON.stringify([-1, -1])) {
                fillInTheCell(start[1], start[0], matrix_color);
            }
            if (JSON.stringify([i, j]) === JSON.stringify(finish)) {
                fillInTheCell(finish[1], finish[0], matrix_color);
                finish = [-1, -1];
            }
            drawACircle(j, i, starting_flag_color);
            start[0] = i;
            start[1] = j;
            break;

        case 'finish':
            if (matrix[i][j]) {
                matrix[i][j] = 0;
                fillInTheCell(j, i, matrix_color);
            }
            if (JSON.stringify(start) === JSON.stringify([i, j])) {
                fillInTheCell(start[1], start[0], matrix_color);
                start = [-1, -1];
            }
            if (JSON.stringify(finish) !== JSON.stringify([-1, -1])) {
                fillInTheCell(finish[1], finish[0], matrix_color);
            }
            drawACircle(j, i, finish_flag_color);
            finish[0] = i;
            finish[1] = j;
            break;
    }
}




function Queue() {
    let Array = [];
    //Добавляем ячейку и расстояние
    this.add = function (cell) {
        if (this.isEmpty()) {
            Array.push(cell);
        }
        else {
            let fl = false;
            for (let i = 0; i < Array.length; i++) {
                if (cell[1] < Array[i][1]) {
                    Array.splice(i, 0, cell);
                    fl = true;
                    break;
                }
            }
            if (!fl) {
                Array.push(cell);
            }
        }
    }

    this.takeFirst = function () {
        return Array.shift();
    }

    this.isEmpty = function () {
        return Array.length === 0;
    }
}

function heuristic(cur, finish, choice_of_heuristics) {
    if(choice_of_heuristics === 0){
        return Math.max(Math.abs(finish[0] - cur[0]), Math.abs(finish[1] - cur[1]));//Расстояние Чебышева
    }
    return Math.abs(finish[0] - cur[0]) + Math.abs(finish[1] - cur[1]);//манхэттенское расстояние
}

function getNeigbors(cur, matrix, G) {
    let return_neighbours = [];
    let x = cur[0][0];
    let y = cur[0][1];
    if (y != n - 1 && !matrix[x][y + 1] && G[x][y + 1] === -1) {
        return_neighbours.push([x, y + 1]);
    }
    if (x != n - 1 && !matrix[x + 1][y] && G[x + 1][y] === -1) {
        return_neighbours.push([x + 1, y]);
    }
    if (x != 0 && !matrix[x - 1][y] && G[x - 1][y] === -1) {
        return_neighbours.push([x - 1, y]);
    }
    if (y != 0 && !matrix[x][y - 1] && G[x][y - 1] === -1) {
        return_neighbours.push([x, y - 1]);
    }
    if (x > 0 && y > 0 && !matrix[x - 1][y - 1] && G[x - 1][y - 1] === -1) {
        return_neighbours.push([x - 1, y - 1]);
    }
    if (x < n - 1 && y < n - 1 && !matrix[x + 1][y + 1] && G[x + 1][y + 1] === -1) {
        return_neighbours.push([x + 1, y + 1]);
    }
    if (x > 0 && y < n - 1 && !matrix[x - 1][y + 1] && G[x - 1][y + 1] === -1) {
        return_neighbours.push([x - 1, y + 1]);
    }
    if (x < n - 1 && y > 0 && !matrix[x + 1][y - 1] && G[x + 1][y - 1] === -1) {
        return_neighbours.push([x + 1, y - 1]);
    }
    return return_neighbours;
}

async function aStar(start, finish) {
    
    if ((JSON.stringify(start) === JSON.stringify([-1, -1])) || (JSON.stringify(finish) === JSON.stringify([-1, -1])) || !matrix){
        alert("Введите все данные!");
        return;
    }
    const choice_of_heuristics = document.querySelector('input[name="heuristics"]:checked').value;
    clearMapOfPath();
    let queue = new Queue();
    let GScores = getMatrix(-1);
    GScores[start[0]][start[1]] = 0;
    let parents = [];//массив родителей(для окраски самого короткого пути)
    for (let i = 0; i < n; i++) {
        parents[i] = new Array(n)
        for (let j = 0; j < n; j++) {
            parents[i][j] = new Array(2);
            parents[i][j][0] = -1;//координаты, дочерней клетки
            parents[i][j][1] = -1;
        }
    }
    queue.add([start, heuristic(start, finish, choice_of_heuristics)]);
    while (!queue.isEmpty()) {
        let current = queue.takeFirst();
        if (current[0][0] === finish[0] && current[0][1] === finish[1]) {
            break;
        }
        let neighbours = getNeigbors(current, matrix, GScores);
        for (let i = 0; i < neighbours.length; i++) {
            let neigbor = neighbours[i];
            drawACircle(neigbor[1], neigbor[0], motion_animation_color);
            await wait();
            drawACircle(neigbor[1], neigbor[0], passed_cells_color);
            let nX = neigbor[0];
            let nY = neigbor[1];
            let cX = current[0][0];
            let cY = current[0][1];
            if (GScores[nX, nY] === -1 || GScores[cX][cY] + 1 > GScores[nX][nY]) {
                parents[nX][nY][0] = cX;
                parents[nX][nY][1] = cY;
                GScores[nX][nY] = GScores[cX][cY] + 1;
                queue.add([neigbor, GScores[nX][nY] + heuristic(neigbor, finish, choice_of_heuristics)]);
            }
        }
    }
    drawACircle(finish[1], finish[0], finish_flag_color);
    if (JSON.stringify(parents[finish[0]][finish[1]]) !== JSON.stringify([-1, -1])) {
        let cell = parents[finish[0]][finish[1]];
        while (cell[0] !== -1 && cell[1] !== -1) {
            drawACircle(cell[1], cell[0], path_color);
            cell = parents[cell[0]][cell[1]];
        }
        drawACircle(start[1], start[0], starting_flag_color);
    }
    else {
        alert("Пути нет!");
    }
}

//стрелочная функция ожидания
async function wait() {
    return new Promise(resolve => setTimeout(resolve, 1000 / n));
}


function generateLabyrinth(){
    if(!n){
        alert("Создайте карту!");
        return;
    }
    createTableMarkup();
    map = getMatrix(1);
	function isEven(n) {
		return n % 2 === 0;
	}
	function getRandomFrom(array) {
		const index = Math.floor(Math.random() * array.length);
		return array[index];
	}
	const startX = getRandomFrom(Array(n).fill(0).map((item, index) => index).filter(x => isEven(x)));
	const startY = getRandomFrom(Array(n).fill(0).map((item, index) => index).filter(x => isEven(x)));
	let tractor = {};
	tractor.x = startX;
	tractor.y = startY;
	function setField (x, y, value) {
		if (x < 0 || x >= n || y < 0 || y >= n) {
			return null;
		};
		map[x][y] = value;
	}
	setField(startX, startY, 0);
	function isMaze () {
		for (let x = 0; x < n; x++) {
			for (let y = 0; y < n; y++) { 
				if (isEven(x) && isEven(y) && getField(x, y) === 1) {
					return false;
				}
			}
		}
		return true;
	}
	while (!isMaze()) {
		moveTractor();
	}
    if(!matrix){
        matrix = getMatrix(0);
    }
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            matrix[i][j] = map[i][j];
        }
    }
    colorMap();
	return;
	function getField(x, y) {
		if (x < 0 || x >= n || y < 0 || y >= n) {
			return null;
		}
		return map[x][y];
	}
	function moveTractor() {
		const directs = [];
		if (tractor.x > 0) {
			directs.push('left');
		};
		if (tractor.x < n - 2) {
			directs.push('right');
		};	
		if (tractor.y > 0) {
			directs.push('up');
		};
		if (tractor.y < n - 2) {
			directs.push('down');
		};
		const direct = getRandomFrom(directs);
		switch (direct) {
			case 'left':
				if (getField(tractor.x - 2, tractor.y) === 1) {
					setField(tractor.x - 1, tractor.y, 0);
					setField(tractor.x - 2, tractor.y, 0);
				};
				tractor.x -= 2;
				break;
			case 'right':
				if (getField(tractor.x + 2, tractor.y) === 1) {
					setField(tractor.x + 1, tractor.y, 0);
					setField(tractor.x + 2, tractor.y, 0);
				};
				tractor.x += 2;
				break;
			case 'up':
				if (getField(tractor.x, tractor.y - 2) === 1) {
					setField(tractor.x, tractor.y - 1, 0);
					setField(tractor.x, tractor.y - 2, 0);
				};
				tractor.y -= 2
				break;
			case 'down':
				if (getField(tractor.x, tractor.y + 2) === 1) {
					setField(tractor.x, tractor.y + 1, 0);
					setField(tractor.x, tractor.y + 2, 0);
				};
				tractor.y += 2;
				break;
		}
	}
}