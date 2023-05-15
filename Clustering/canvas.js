const canvas = document.querySelectorAll("canvas")[0];
const ctx = canvas.getContext("2d");
const bodySize = document.body.getBoundingClientRect();
if(bodySize.width <= 450){
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.9;
}
else if(bodySize.width <= 900){
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.85;
}
else{
    var size_matrix = Math.min(bodySize.width, bodySize.height) * 0.6;
}
canvas.setAttribute('width',size_matrix);
canvas.setAttribute('height', size_matrix);

let points = [];
let centroids = [];
let colorsForKMeans = [];

canvas.addEventListener('click', (event) => {
    let x = event.offsetX;
    let y = event.offsetY;
    points.push([x, y]);
    createPoint(x, y);
  });
  
function createPoint(x, y) {
   ctx.beginPath();
   ctx.arc(x, y, 5, 0, 2 * Math.PI);
   ctx.fillStyle = "black";
   ctx.fill();
}

function clearMap() {
    ctx.clearRect(0, 0, size_matrix, size_matrix);
    points = [];
    centroids = [];
    colorsForKMeans = [];
}

function createCentroids() {
    let x = Math.random() * size_matrix;
    let y = Math.random() * size_matrix;
    let r = Math.floor(Math.random() * 230);
    let g = Math.floor(Math.random() * 200);
    let b = Math.floor(Math.random() * 150);
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    centroids.push([x, y]);
    colorsForKMeans.push(color);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 20, 20);
    ctx.strokeRect(x, y, 20, 20);
}

let colors = ["blue", "green", "purple", "red", "yellow", "DarkRed", "pink", "orange", "Violet", "BlueViolet", "Indigo", "Lime", "LightCoral", "DarkSalmon", "DeepPink", "Khaki", "Aquamarine"]