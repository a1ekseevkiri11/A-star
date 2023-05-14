function elements() {
    document.querySelectorAll(".p").forEach((p) => {
        p.style.display = "none";
    })
}

elements();

document.querySelector("button.K-means").addEventListener("click", () => {
    elements();
    document.querySelector(".K-meansInputs").style.display = "block";
})

function distance(point_1, point_2) { 
    let distance_x = point_1[0] - point_2[0]; 
    let distance_y = point_1[1] - point_2[1]; 
    return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); 
}

function updateTheCenter(clasters) {
    let new_Centroid = [];
    for(let i = 0; i < clasters.length; i++) {
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

function clearMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    centroids = [];
    colors =[];
}

function KMeans() {
    let clasters = new Array(centroids.length);
    for(let i = 0; i < points.length * 100; i++) {
        for(let i = 0; i < centroids.length; i++) {
            clasters[i] = [];
        }
        for(let i = 0; i < points.length; i++) {
            let min_index = 0;
            let point = points[i];
            let min_distance = 10000;
            for(let j = 0; j < centroids.length; j++) {
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
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < centroids.length; i++) {
        ctx.strokeRect(centroids[i][0], centroids[i][1], 20, 20);
        ctx.fillStyle = colorsForKMeans[i];
        ctx.fillRect(centroids[i][0], centroids[i][1], 20, 20);
        for(let j in clasters[i]) {
            ctx.beginPath();
            ctx.fillStyle = colorsForKMeans[i];
            ctx.arc(clasters[i][j][0], clasters[i][j][1], 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}