var CircuitStore = function () {
  this.circuits = [];
};

CircuitStore.prototype.save = function (key, circuit) {
  this.circuits[key] = circuit;
};

CircuitStore.prototype.load = function (key) {
  console.log(key);
  return this.circuits[key];
};