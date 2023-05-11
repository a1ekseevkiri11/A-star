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
    if(choice_of_heuristics == 0){
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