const point_color = "black";
const point_radius = 10;
const connecting_line_thickness = 3;
const connecting_line_color = "blue";
const update_time = 20;


const canvas = document.getElementById("canvas");
const plane = canvas.getContext("2d");
const width_plane = canvas.width;
const height_plane = canvas.height;


const population_size = 1000;
const mutation_rate = 0.05;
const number_iterations = 10000;

let cities = [];

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
    plane.clearRect(0, 0, width_plane, height_plane);
    cities = [];
    number_of_cities = 0;
}

function mapUpdate(){
    plane.clearRect(0, 0, width_plane, height_plane);
    updatePoint();
}

function updatePoint(){
    for (let i = 0; i < cities.length; i++){
        drawAPoint(cities[i]);
    }
}

function connectLines(point1, point2){
    plane.beginPath();
    plane.lineWidth = connecting_line_thickness;
    plane.strokeStyle = connecting_line_color;
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

function getFirstPopulation(number_of_cities){
    let population = [];
    for (let i = 0; i < population_size; i++){
        let order = [];
        for (let j = 0; j < number_of_cities; j++){
            order[j] = j;
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
    return population;
}

async function geneticAlgorithm(){
    let population = [];
    let number_of_cities = cities.length;
    if (number_of_cities === 0){
        alert("Расставьте точки!");
        return;
    }
    population = getFirstPopulation(number_of_cities);
    let previous_best = [];
    let counter = 0;
    for(let i = 0; i < number_iterations; i++){
        population = nextGeneration(population);
        connectLinesPath(population[0]);
        updatePoint();
        if (previous_best === population[0]){
            counter++;
        }
        if(previous_best !== population[0]){
            counter = 0;
        }
        if (counter > 20){
            break;
        }
        previous_best = population[0];
        await wait();
        mapUpdate();
    }
    connectLinesPath(population[0]);
    updatePoint();
    alert("Путь найден!");
}

function nextGeneration(population) {
    for (let i = 0; i < population_size; i++) {
        let orderA = population[Math.floor(Math.random() * population_size)];
        let orderB = population[Math.floor(Math.random() * population_size)];
        while (orderA === orderB){
            orderB = population[Math.floor(Math.random() * population_size)];
        }
        let order = crossOver(orderA, orderB);
        population.push(order);
    }
    population.sort((a, b) => getDistancePath(a) - getDistancePath(b));
    return population.slice(0, population_size);
    
}

function crossOver(orderA, orderB) {
    let stop = Math.floor(Math.random() * orderA.length);
    let neworder = [];
    for(let i = 0; i < stop; i++){
        neworder.push(orderA[i]);
    }
    for(let i = 0; i < orderB.length; i++){
        if(!neworder.includes(orderB[i])){
            neworder.push(orderB[i]);
        }
    }
    mutate(neworder);
    return neworder;
}

function mutate(order) {
    for (let i = 0; i < order.length; i++) {
        if (Math.random(1) < mutation_rate) {
            let indexA = Math.floor(Math.random(order.length));
            let indexB = (indexA + 1) % order.length;
            [order[indexA], order[indexB]] = [order[indexB], order[indexA]];
        }
    }
    return order;
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
    return new Promise(resolve => setTimeout(resolve, update_time));
}