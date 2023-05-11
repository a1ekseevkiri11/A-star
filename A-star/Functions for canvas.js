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