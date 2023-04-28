const point_color = "black";
const point_radius = 10;
const connecting_line_thickness = 3;


const canvas = document.getElementById("canvas");
const plane = canvas.getContext("2d");
const width_plane = canvas.width;
const height_plane = canvas.height;


const population_size = 1000;
const mutation_rate = 0.01;
const number_iterations = 10000;

let cities = [];
let number_of_cities;
let population = [];


//работа с canvas
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
    plane.fill();
    plane.stroke();
}

function clearMap() {
    plane.clearRect(0, 0, width_plane, height_plane);
    cities = [];
    number_of_cities = 0;
    population = [];
}

function mapUpdate(){
    plane.clearRect(0, 0, width_plane, height_plane);
    for (let i = 0; i < cities.length; i++){
        drawAPoint(cities[i]);
    }
}

function connectLines(point1, point2){
    plane.beginPath();
    plane.lineWidth = connecting_line_thickness;
    plane.moveTo(point1.x, point1.y);
    plane.lineTo(point2.x, point2.y);
    plane.stroke();
}

function connectLinesPath(array){
    for(let i = 0; i < array.length - 1; i++){
        connectLines(cities[array[i]], cities[array[i + 1]]);
    }
    connectLines(cities[array[0]], cities[array[array.length - 1]]);
}
///////////////////////////////////////////


//генетический алгоритм...



function getFirstPopulation(population){
    number_of_cities = cities.length;
    for (let i = 0; i < population_size; i++){
        let order = [];
        for (let i = 0; i < number_of_cities; i++){
            order[i] = i;
        }
        for (let j = 0; j < number_of_cities; j++){
            let x = Math.floor(Math.random() * number_of_cities);
            let y = Math.floor(Math.random() * number_of_cities);
            while(x === y){
                y = Math.floor(Math.random() * number_of_cities);
            }
            [order[x], order[y]] = [order[y], order[x]];
        }
        population[i] = order;
    }
}




function getDistancePath(array){
    let sum = 0;
    for (let i = 0; i < array.length - 1; i++){
        sum += distance(cities[array[i]], cities[array[i + 1]]);
    }
    sum += distance(cities[array[0]], cities[array[array.length - 1]]);
    return sum;
}

function distance(point1, point2){
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}