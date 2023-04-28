const canvas = document.querySelector('canvas');
const plane_width = canvas.width;
const plane_height = canvas.height;
const ctx = canvas.getContext('2d');
let points = [];
let centroids = [];
let colors = [];

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

function createCentroids() {
    let x = Math.random() * plane_width;
    let y = Math.random() * plane_height;
    let r = Math.floor(Math.random() * 250);
    let g = Math.floor(Math.random() * 250);
    let b = Math.floor(Math.random() * 250);
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    centroids.push([x, y]);
    colors.push(color);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 20, 20);
}

function distance(point_1, point_2) { 
    let distance_x = point_1[0] - point_2[0]; 
    let distance_y = point_1[1] - point_2[1]; 
    return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); 
}

function updateTheCenter(clasters) {
    let new_Centroid = [];
    for(let i in clasters) {
        let summ_x = 0;
        let summ_y = 0;
        for(let j in clasters[i]) {
            summ_x += clasters[i][j][0];
            summ_y += clasters[i][j][1];
        }
        summ_x /= clasters[i].length;
        summ_y /= clasters[i].length;
        new_Centroid.push([summ_x, summ_y]);
    }
    return new_Centroid;
}

function delitMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    centroids = [];
}

function KMeans() {
    let clasters = new Array(centroids.length);
    for(let i = 0; i<points.length * 100; i++) {
        for(let i in centroids) {
            clasters[i] = [];
        }
        for(let i in points) {
            let min_index = 0;
            let point = points[i];
            let min_distance = 10000;
            for(let j in centroids) {
                let center = centroids[j];
                let dist = distance(point, center);
                if(dist < min_distance) {
                    min_distance = dist;
                    min_index = j;
                }
            }
            clasters[min_index].push(points[i]);
        } 
        let new_Centroid = updateTheCenter(clasters);
        if(new_Centroid === centroids) {
            break;
        }
        else {
            centroids = new_Centroid;
            console.log(centroids);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i in centroids) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(centroids[i][0], centroids[i][1], 20, 20);
        for(let j in clasters[i]) {
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.arc(clasters[i][j][0], clasters[i][j][1], 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}