const matrix_color = "white";
const pen_color = "black";

function createTable() {
  let container = document.getElementById("table-container");
  let table = document.createElement("table");
  for (let i = 0; i < 5; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 5; j++){
      let cell = document.createElement("td");
      cell.style.backgroundColor = matrix_color;
      cell.addEventListener("click", function() {
        let color = this.style.backgroundColor;
        if(color === matrix_color){
          cell.style.backgroundColor = pen_color;
        }
        else {
          cell.style.backgroundColor = matrix_color;
        }
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.innerHTML = "";
  container.appendChild(table);
}

function createMatrix(){
  let matrix = [];
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < 5; i++){
    for(let j = 0; j < 5; j++){
      if (table.rows[i].cells[j].style.backgroundColor === pen_color){
        matrix[i * 5 + j] = 1;
      }
      else{
        matrix[i * 5 + j] = 0;
      }
    }
  }
  const network = new Network(25, 10);
  network.train(data);
  network.input = matrix;
  maxZnach = 0;
  indx = 0;
  for (let i = 0; i < 10; i++){
    if (network.prediction[i] > maxZnach){
      maxZnach = network.prediction[i];
      indx = i;
    }
  }
  alert(indx);
}

function clearTable(){
  let container = document.getElementById("table-container");
  let table = container.querySelector("table");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++){
      table.rows[i].cells[j].style.backgroundColor = matrix_color;
    }
  }
  container.innerHTML = "";
  container.appendChild(table);
}



const data = [
  [[0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]],
  [[0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]],
  [[0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]],
  [[0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]
 ];
 


class Input {
  constructor(neuron, weight) {
    this.neuron = neuron;
    this.weight = weight;
  }
}

class Neuron {
  constructor(layer, previousLayer) {
    this._layer = layer;
    this.inputs = previousLayer
      ? previousLayer.neurons.map((neuron) => new Input(neuron, Math.random() - 0.5))
      : [0];
  }
 
  get $isFirstLayerNeuron() {
    return !(this.inputs[0] instanceof Input)
  }
 
  get inputSum() {
    return this.inputs.reduce((sum, input) => {
      return sum + input.neuron.value * input.weight;
    }, 0);
  }
 
  get value() {
    return this.$isFirstLayerNeuron
      ? this.inputs[0]
      : this._layer._network.activationFunction(this.inputSum);
  }
 
  set input(val) {
    if (!this.$isFirstLayerNeuron) {
      return;
    }
 
    this.inputs[0] = val;
  }
 
  set error(error) {
    if (this.$isFirstLayerNeuron) {
      return;
    }
 
    const wDelta = error * this._layer._network.derivativeFunction(this.inputSum);
 
    this.inputs.forEach((input) => {
      input.weight -= input.neuron.value * wDelta * this._layer._network.learningRate;
      input.neuron.error = input.weight * wDelta;
    });
  }
}



class Layer {
  constructor(neuronsCount, previousLayer, network) {
    this._network = network;
    this.neurons = [];
    for (let i = 0; i < neuronsCount; i++) {
      this.neurons.push(new Neuron(this, previousLayer));
    }
  }
 
  get $isFirstLayer() {
    return this.neurons[0].$isFirstLayerNeuron;
  }
 
  set input(val) {
    if (!this.$isFirstLayer) {
      return;
    }
 
    if (!Array.isArray(val)) {
      return;
    }
 
    if (val.length !== this.neurons.length) {
      return;
    }
 
    val.forEach((v, i) => this.neurons[i].input = v);
  }
}


class Network {
  static  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
 
  static sigmoidDerivative(x) {
    return Network.sigmoid(x) * (1 - Network.sigmoid(x));
  }
 
  constructor(inputSize, outputSize, hiddenLayersCount = 1, learningRate = 0.5) {
    this.activationFunction = Network.sigmoid;
    this.derivativeFunction = Network.sigmoidDerivative;
    this.learningRate = learningRate;
 
    this.layers = [new Layer(inputSize, null, this)];
 
    for (let i = 0; i < hiddenLayersCount; i++) {
      const layerSize = Math.min(inputSize * 2 - 1, Math.ceil((inputSize * 2 / 3) + outputSize));
      this.layers.push(new Layer(layerSize, this.layers[this.layers.length - 1], this));
    }
 
    this.layers.push(new Layer(outputSize, this.layers[this.layers.length - 1], this));
  }
 
  set input(val) {
    this.layers[0].input = val;
  }
 
  get prediction() {
    return this.layers[this.layers.length - 1].neurons.map((neuron) => neuron.value);
  }
 
  trainOnce(dataSet) {
    if (!Array.isArray(dataSet)) {
      return;
    }
 
    dataSet.forEach((dataCase) => {
      const [input, expected] = dataCase;
 
      this.input = input;
      this.prediction.forEach((r, i) => {
        this.layers[this.layers.length - 1].neurons[i].error = r - expected[i];
      });
    });
  }
 
  train(dataSet, epochs = 1000) {
    return new Promise(resolve => {
      for (let i = 0; i < epochs; i++) {
        this.trainOnce(dataSet);
      }
      resolve();
    });
  }
}





 