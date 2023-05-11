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