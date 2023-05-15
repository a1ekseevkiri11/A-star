document.getElementById("geneticAlgorithm").addEventListener("click", geneticAlgorithm);

const point_color = "black";
const connecting_line_color = "blue";
const connecting_line_color_finish = "green";
const update_time = 5;

const canvas = document.getElementById("canvas");
const plane = canvas.getContext("2d");
const bodySize = document.body.getBoundingClientRect();
if(bodySize.width <= 450){
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.9;
    var point_radius = 4;
    var connecting_line_thickness = 2;
}
else if(bodySize.width <= 900){
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.8;
    var point_radius = 6;
    var connecting_line_thickness = 2;
}
else{
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.6;
    var point_radius = 10;
    var connecting_line_thickness = 3;
}
canvas.setAttribute('width',size_matrix);
canvas.setAttribute('height', size_matrix);


const mutation_rate = 0.05;
const number_iterations = 100000;


let population_size;
let cities = [];


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
        connectLinesPath(population[0], connecting_line_color);
        updatePoint();
        if (previous_best === population[0]){
            counter++;
        }
        if(previous_best !== population[0]){
            counter = 0;
        }
        if (counter > cities.length * 2){
            break;
        }
        previous_best = population[0];
        await wait();
        mapUpdate();
    }
    connectLinesPath(population[0], connecting_line_color_finish);
    updatePoint();
    alert("Путь найден!");
}

function getFirstPopulation(number_of_cities){
    population_size = cities.length * 250;
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