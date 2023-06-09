document.getElementById("clearMap").addEventListener("click", clearMap);

canvas.addEventListener("click", function(e){
    let point_coordinate = {
        x:e.pageX - this.offsetLeft,
        y:e.pageY - this.offsetTop
    };
    cities.push(point_coordinate);
    drawAPoint(point_coordinate);
});

function drawAPoint(point){
    plane.beginPath();
    plane.arc(point.x, point.y, point_radius, 0, 2 * Math.PI);
    plane.fillStyle = point_color;
    plane.strokeStyle = point_color;
    plane.fill();
    plane.stroke();
}

function clearMap() {
    plane.clearRect(0, 0, size_matrix, size_matrix);
    cities = [];
    number_of_cities = 0;
}

function mapUpdate(){
    plane.clearRect(0, 0, size_matrix, size_matrix);
    updatePoint();
}

function updatePoint(){
    for (let i = 0; i < cities.length; i++){
        drawAPoint(cities[i]);
    }
}

function connectLines(point1, point2, color){
    plane.beginPath();
    plane.lineWidth = connecting_line_thickness;
    plane.strokeStyle =  color;
    plane.moveTo(point1.x, point1.y);
    plane.lineTo(point2.x, point2.y);
    plane.stroke();
}

function connectLinesPath(array, color){
    for(let i = 0; i < array.length - 1; i++){
        connectLines(cities[array[i]], cities[array[i + 1]], color);
    }
    connectLines(cities[array[0]], cities[array[array.length - 1]], color);
}