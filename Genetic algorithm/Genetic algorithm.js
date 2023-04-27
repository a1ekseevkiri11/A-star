const point_color = "black";
const point_radius = 10;
const connecting_line_thickness = 3;


const canvas = document.getElementById("canvas");
const plane = canvas.getContext("2d");
const width_plane = canvas.width;
const height_plane = canvas.height;


const population_size = 1000;
const mutation_rate = 0.05;
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

function shuffle(arr) { 
    for(let i = 0; i < arr.length; i++) 
    { 
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice();
}

async function geneticAlgorithm(){
    number_of_cities = cities.length;
    if (number_of_cities === 0){
        alert("Расставьте точки!");
        return;
    }
    let order = [];
    for (let i = 0; i < number_of_cities; i++){
        order[i] = i;
    }
    for (let i = 0; i < population_size; i++){
        population[i] = shuffle(order);
    }
    let previous_best = [];
    let counter = 0;
    for(let i = 0; i < number_iterations; i++){
        nextGeneration();
        connectLinesPath(population[0]);
        await wait();
        if (previous_best === population[0]){
            counter++;
        }
        if (counter > 50){
            break;
        }
        previous_best = population[0];
        mapUpdate();
    }
    connectLinesPath(population[0]);
    alert("Путь найден!");
}

function nextGeneration() {
    let newPopulation = population;
    for (let i = 0; i < population_size; i++) {
        let orderA = population[Math.floor(Math.random() * population_size)];
        let orderB = population[Math.floor(Math.random() * population_size)];
        while (orderA === orderB){
            orderB = population[Math.floor(Math.random() * population_size)];
        }
        let order = crossOver(orderA, orderB);
        mutate(order);
        newPopulation.push(order);
    }
    newPopulation.sort((a, b) => getDistancePath(a) - getDistancePath(b));
    population = newPopulation.slice(0, population_size);
}

function crossOver(orderA, orderB) {
    let start = Math.floor(Math.random(orderA.length));
    let finish = Math.floor(Math.random(start + 1, orderA.length));
    let neworder = orderA.slice(start, finish);
    for (let i = 0; i < orderB.length; i++) {
        let city = orderB[i];
        if (!neworder.includes(city)) {
            neworder.push(city);
        }
    }
    return neworder;
}

function mutate(order) {
    for (let i = 0; i < number_of_cities; i++) {
        if (Math.random(1) < mutation_rate) {
            let indexA = Math.floor(Math.random(order.length));
            let indexB = (indexA + 1) % number_of_cities;
            [order[indexA], order[indexB]] = [order[indexB], order[indexA]];
        }
    }
    return order.slice();
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

async function wait() {
    return new Promise(resolve => setTimeout(resolve, 20));
}