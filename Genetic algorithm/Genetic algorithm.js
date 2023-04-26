const point_color = "black";
const point_radius = 10;
const connecting_line_thickness = 3;


const canvas = document.getElementById("canvas");
const plane = canvas.getContext("2d");
const width_plane = canvas.width;
const height_plane = canvas.height;


const population_size = 500;
const mutation_rate = 0.01;
const number_iterations = 50;

let cities = [];
let number_of_cities;
let fitness = [];
let population = [];
let record_distance = Infinity;
let best_ever;
let current_best;


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
    fitness = [];
    population = [];
    record_distance = Infinity;
    best_ever = [];
    current_best = [];
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
        let tmp =  arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr.map(function (item) { 
        return item;   
    });
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
    let previous_best_ever = 0;
    let counter = 0;
    while(true){
        if(previous_best_ever === best_ever && counter > number_iterations){
            break;
        }
        if(previous_best_ever === best_ever){
            counter++;
        }
        previous_best_ever = best_ever;
        calculateFitness();
        normalizeFitness();
        nextGeneration();
        connectLinesPath(current_best);
        await wait();
        mapUpdate();
    }
    connectLinesPath(best_ever);
    alert("Путь найден!");
}

function calculateFitness(){
    let current_record = Infinity;
    for (let i = 0; i < population.length; i++) {
        const d = getDistancePath(population[i]);
        if (d < record_distance) {
            record_distance = d;
            best_ever = population[i];
        }
        if (d < current_record) {
            current_record = d;
            current_best = population[i];
        }
        fitness[i] = 1 / (Math.pow(d, 8) + 1);
    }
}

function normalizeFitness() {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function nextGeneration() {
    const newPopulation = [];
    for (var i = 0; i < population.length; i++) {
        const orderA = getOne(population, fitness);
        const orderB = getOne(population, fitness);
        const order = crossOver(orderA, orderB);
        mutate(order);
        newPopulation[i] = order;
    }
    population = newPopulation;
}

function getOne(list, prob) {
    let index = 0;
    let r = Math.random(1);
    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

function crossOver(orderA, orderB) {
    const start = Math.floor(Math.random(orderA.length));
    const finish = Math.floor(Math.random(start + 1, orderA.length));
    const neworder = orderA.slice(start, finish);
    for (let i = 0; i < orderB.length; i++) {
        const city = orderB[i];
        if (!neworder.includes(city)) {
            neworder.push(city);
        }
    }
    return neworder;
}

function mutate(order) {
    for (let i = 0; i < number_of_cities; i++) {
        if (Math.random(1) < mutation_rate) {
            const indexA = Math.floor(Math.random(order.length));
            const indexB = (indexA + 1) % number_of_cities;
            [order[indexA], order[indexB]] = [order[indexB], order[indexA]];
        }
    }
    return order.map(function (item) { 
        return item;   
    });
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
    return new Promise(resolve => setTimeout(resolve, 100));
}