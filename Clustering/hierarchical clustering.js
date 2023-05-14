function elements() {
  document.querySelectorAll(".p").forEach((p) => {
      p.style.display = "none";
  })
}

elements();

document.querySelector("button.hierarchy").addEventListener("click", () => {
  elements();
  document.querySelector(".hierarchicInputs").style.display = "block";
})

function distance(point_1, point_2) { 
    let distance_x = point_1[0] - point_2[0]; 
    let distance_y = point_1[1] - point_2[1]; 
    return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); 
}

function minDistance(cluster_1, cluster_2) {
    let min_distance = Infinity;

    for (let i = 0; i < cluster_1.length; i++) {
      for (let j = 0; j < cluster_2.length; j++) {
        const d = distance(cluster_1[i], cluster_2[j]);
        if (d < min_distance) {
          min_distance = d;
        }
      }
    }

    return min_distance;
}

function hierarchicalClustering() {
	centroids = [];
  colorsForKMeans = [];
  let number = document.getElementById("clustersNumber").value;
  if (number > points.length) {
    alert("Слишком много кластеров");
    return;
  }
  let clusters = [];
  for(let i = 0; i < points.length; i++) {
    clusters.push([points[i]]);
  }
  while (clusters.length > number) {
    let min_distance = Infinity;
    let c1, c2;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        let d = minDistance(clusters[i], clusters[j]);
        if (d < min_distance) {
          min_distance = d;
          c1 = i;
          c2 = j;
        }
      }
    }
    clusters[c1] = clusters[c1].concat(clusters[c2]);
    clusters.splice(c2, 1);
  }
  drawClusters(clusters);
}

function drawClusters(clusters) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < clusters.length; i++) {
    const color = colors[i];
    for (let j = 0; j < clusters[i].length; j++) {
      const [x, y] = clusters[i][j];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
} 