const eps = 50;
const min_Pts = 3;

function elements() {
    document.querySelectorAll(".p").forEach((p) => {
        p.style.display = "none";
    })
}

elements();

document.querySelector("button.DBSCAN").addEventListener("click", () => {
    elements();
    document.querySelector(".DBSCANInptus").style.display = "block";
})

function drawResult(labels, clusters, noise) {
	let point_index;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < clusters.length; i++) {
        for(let j = 0; j < clusters[i].length; j++) {
			point_index = clusters[i][j];
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.arc(points[point_index][0], points[point_index][1], 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
	for(let i = 0; i < points.length; i++) {
		if(labels[i] == noise) {
			ctx.beginPath();
            ctx.fillStyle = "grey";
            ctx.arc(points[i][0], points[i][1], 5, 0, 2 * Math.PI);
            ctx.fill();
		}
	}
}

function distance(point_1, point_2) { 
    let distance_x = point_1[0] - point_2[0]; 
    let distance_y = point_1[1] - point_2[1]; 
    return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); 
}

function regionQuery(pointIndex) {
	let neighbors = [];
	for (let i = 0; i < points.length; i++) {
		if (distance(points[pointIndex], points[i]) < eps) {
			neighbors.push(i);
		}
	}
	return neighbors;
}

function DBSCAN() {
	centroids = [];
	colorsForKMeans = [];
	const unclassified = -1;
    const noise = -2;
	let clusters = [];
	let clusterIndex = 0;
	let labels = new Array(points.length).fill(unclassified);
	for (let i = 0; i < points.length; i++) {
		if (labels[i] != unclassified) {
			continue;
		}
		let neighbors = regionQuery(i);
		if (neighbors.length < min_Pts) {
			labels[i] = noise;
			continue;
		}
		clusters[clusterIndex] = [i];
		labels[i] = clusterIndex;
		for (let k = 0; k < clusters[clusterIndex].length; k++) {
			let pointIndex = clusters[clusterIndex][k];
			let pointNeighbors = regionQuery(pointIndex);
			for (let j = 0; j < pointNeighbors.length; j++) {
				let neighborIndex = pointNeighbors[j];
				if (labels[neighborIndex] == unclassified || labels[neighborIndex] == noise) {
					clusters[clusterIndex].push(neighborIndex);
					labels[neighborIndex] = clusterIndex;
				}
			}
        }
        clusterIndex++;
    }
	drawResult(labels, clusters, noise);
}