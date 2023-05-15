const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const bodySize = document.body.getBoundingClientRect();
const update_time = 5;

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


const alpha = 2;
const beta = 5;
const change_pheromon = 0.2;


let cities = [];
let distances = [];
let pheromones = [];

canvas.addEventListener('click', (event) => {
    let x = event.offsetX;
    let y = event.offsetY;
    cities.push([x, y]);
    createPoint(x, y);
  });

  function createPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, point_radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
 }

 function drawResult(best_way, color) {
    ctx.clearRect(0, 0, size_matrix, size_matrix);
    ctx.beginPath();
    ctx.moveTo(cities[best_way[0]][0], cities[best_way[0]][1]);
    for (let i = 1; i < best_way.length; i++) {
        ctx.lineTo(cities[best_way[i]][0], cities[best_way[i]][1]);
    }
    ctx.lineTo(cities[best_way[0]][0], cities[best_way[0]][1]);
    ctx.lineWidth = connecting_line_thickness;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    for(let i = 0; i < cities.length; i++) {
        ctx.beginPath();
        ctx.arc(cities[i][0], cities[i][1], point_radius, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }
 }

 function clearMap() {
    ctx.clearRect(0, 0, size_matrix, size_matrix);
    cities = [];
    pheromones = [];
    distances = [];
}

function distance(point_1, point_2) { 
    let distance_x = point_1[0] - point_2[0]; 
    let distance_y = point_1[1] - point_2[1]; 
    return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); 
}

function allDistanceForPath(path) {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
        dist += distance(cities[path[i]], cities[path[i + 1]]);
    }
    dist += distance(cities[path[path.length - 1]], cities[path[0]]);
    return dist;
}

function chooseNextCity(visited) {
    let i = visited[visited.length - 1];
    let summ = 0;
    let probabilities = [];
    for(let j = 0; j < cities.length; j++) {
        if(visited.includes(j)) {
            continue;
        }
        let pheromone = Math.pow(pheromones[i][j], alpha);
        let distance = 1 / Math.pow(distances[i][j], beta);
        let prob = pheromone * distance;
        summ += prob;
        probabilities.push([j, prob]);
    }
    probabilities.forEach(element => element[1] /= summ);
    let random = Math.random();
    summ = 0;
    for(let i = 0; i < probabilities.length; i++) {
        summ += probabilities[i][1];
        if(random < summ) {
            return probabilities[i][0];
        }
    }
    return probabilities[0][0];
}

async function wait() {
    return new Promise(resolve => setTimeout(resolve, 20));
}

async function antAlgorithm() {
    for(let i = 0; i < cities.length; i++) {
        distances[i] = new Array(cities.length);
        pheromones[i] = new Array(cities.length);
        for(let j = 0; j < cities.length; j++) {
            distances[i][j] = distance(cities[i], cities[j]);
            pheromones[i][j] = 1;
        }
    }
    let best_way = null;
    let best_length = Infinity;
    let count = 0;
    let previous_best_way;
    for(let iteration = 0; iteration < 100000; iteration++) {
        for(let ant = 0; ant < cities.length * 2; ant++) {
            let start = Math.floor(Math.random() * cities.length);
            let way = [start];
            let visited = [start];
            for(let i = 0; i < cities.length - 1; i++) {
                let next_city = chooseNextCity(visited);
                way.push(next_city);
                visited.push(next_city);
            }
            let length = allDistanceForPath(way);
            if(length < best_length) {
                best_length = length;
                best_way = way;
            }
            for(let i = 0; i < way.length - 1; i++) {
                let from = way[i];
                let to = way[i + 1];
                pheromones[from][to] = (1 - change_pheromon) * pheromones[from][to] + change_pheromon / length;
                pheromones[from][to] = pheromones[to][from];
            }
            let from = way[way.length - 1];
            let to = way[0];
            pheromones[from][to] = (1 - change_pheromon) * pheromones[from][to] + change_pheromon / length;
            pheromones[from][to] = pheromones[to][from];
        }
        if(previous_best_way == best_way) {
            count++;
        }
        else {
            count = 0;
        }
        if(count > 75) {
            break;
        }
        previous_best_way = best_way;
        await wait();
        drawResult(best_way, 'red');
    }
    drawResult(best_way, 'green');
    alert("Путь найден!");
}