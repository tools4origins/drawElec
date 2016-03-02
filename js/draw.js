var DrawElec = function (containerSelector) {
  this.container = document.querySelector(containerSelector);
  this.init();
  this.storage = new CircuitStore();
};

DrawElec.prototype.init = function () {
  this.initSizes();
  this.initGrid();
  this.initCircuit();
  this.initItems();
};

DrawElec.prototype.initSizes = function () {
  this.baseUnit = 20;
  this.pinSize = this.baseUnit;
  this.componentSize = {
    width: 3*this.baseUnit,
    height: 0.75*this.baseUnit
  };
};

DrawElec.prototype.initCircuit = function () {
  this.circuitEl = document.createElement("canvas");
  this.circuitEl.setAttribute('class', 'drawElec-circuit');
  this.circuitEl.width = window.innerWidth - 22;
  this.circuitEl.height = window.innerHeight - 60;
  this.container.appendChild(this.circuitEl);

  this.circuit = oCanvas.create({
    canvas: this.circuitEl
  });
};

DrawElec.prototype.initItems = function () {
  this.components = [];
  this.components.pin = this.circuit.display.line({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    stroke: "1px #079",
    cap: "round"
  });

  this.pinIndicators = [];
  this.pinIndicators[0] = this.circuit.display.ellipse({
    radius: 5,
    x: 13,
    y: 13,
    fill: "rgba(255,0,0,0.6)",
    opacity: 0
  });
  this.pinIndicators.push(this.pinIndicators[0].clone());

  for (var i = this.pinIndicators.length - 1; i >= 0; i--) {
    this.circuit.addChild(this.pinIndicators[i]);
  }

  this.drawResistor(4, 3);
  this.drawCapacitor(4, 4);
  this.drawResistor(4, 5);
};

DrawElec.prototype.drawResistor = function (x, y) {
  var box = {
    x: x*this.baseUnit,
    y: y*this.baseUnit - this.componentSize.height/2,
    width: this.componentSize.width,
    height: this.componentSize.height
  };
  var resistor = this.createItem({
    box: box,
    elements: [{
      // resistor itself
      type: "rectangle",
      params: {
        x: 0.25 * box.width,
        y: 0.1 * box.height,
        width: 0.5 * box.width,
        height: 0.8 * box.height
      }
    }, {
      // first pin
      type: "line",
      params: {
        start: {
          x: 0,
          y: 0.5 * box.height
        },
        end: {
          x: 0.25 * box.width,
          y: 0.5 * box.height
        }
      }
    }, {
      // second pin
      type: "line",
      params: {
        start: {
          x: 0.75 * box.width,
          y: 0.5 * box.height
        },
        end: {
          x: box.width,
          y: 0.5 * box.height
        }
      }
    }]
  });

  var drawElec = this;
  var dragAndDropOptions = {
    start: function () {
      for (var i = drawElec.pinIndicators.length - 1; i >= 0; i--) {
        drawElec.pinIndicators[i].fadeIn(700);
      }
    },
    move: function () {
      drawElec.pinIndicators[0].moveTo(
        drawElec.positionOnGrid(this.children[0].abs_x - drawElec.pinSize/2),
        drawElec.positionOnGrid(this.children[0].abs_y)
      );
      drawElec.pinIndicators[1].moveTo(
        drawElec.positionOnGrid(this.children[1].abs_x + drawElec.pinSize/2),
        drawElec.positionOnGrid(this.children[1].abs_y)
      );
    },
    end: function () {
      for (var i = drawElec.pinIndicators.length - 1; i >= 0; i--) {
        drawElec.pinIndicators[i].fadeOut(150);
      }
      this.moveTo(
        (drawElec.pinIndicators[0].abs_x + drawElec.pinIndicators[1].abs_x) / 2 - drawElec.pinSize,
        (drawElec.pinIndicators[0].abs_y + drawElec.pinIndicators[1].abs_y) / 2 - drawElec.componentSize.height/2
      );
    }
  };

  this.circuit.addChild(resistor);
  resistor.dragAndDrop(dragAndDropOptions);
};

DrawElec.prototype.drawCapacitor = function (x, y) {
  var box = {
    x: x * this.baseUnit,
    y: y * this.baseUnit - this.componentSize.height/2,
    width: this.componentSize.width,
    height: this.componentSize.height
  };
  var capacitor = this.createItem({
    box: box,
    elements: [{
      // first plate
      type: "line",
      params: {
        start: {
          x: 0.45 * box.width,
          y: - 0.2 * box.height
        }, end: {
          x: 0.45 * box.width,
          y: 1.2 * box.height
        }
      }
    }, {
      // second plate
      type: "line",
      params: {
        start: {
          x: 0.55 * box.width,
          y: - 0.2 * box.height
        }, end: {
          x: 0.55 * box.width,
          y: 1.2 * box.height
        }
      }
    }, {
      // first pin
      type: "line",
      params: {
        start: {
          x: 0,
          y: 0.5 * box.height
        },
        end: {
          x: 0.45 * box.width,
          y: 0.5 * box.height
        }
      }
    }, {
      // second pin
      type: "line",
      params: {
        start: {
          x: 0.55 * box.width,
          y: 0.5 * box.height
        },
        end: {
          x: box.width,
          y: 0.5 * box.height
        }
      }
    }]
  });

  var drawElec = this;
  var dragAndDropOptions = {
    start: function () {
      for (var i = drawElec.pinIndicators.length - 1; i >= 0; i--) {
        drawElec.pinIndicators[i].fadeIn(700);
      }
    },
    move: function () {
      drawElec.pinIndicators[0].moveTo(
        drawElec.positionOnGrid(this.children[0].abs_x - drawElec.pinSize/2),
        drawElec.positionOnGrid(this.children[0].abs_y)
      );
      drawElec.pinIndicators[1].moveTo(
        drawElec.positionOnGrid(this.children[1].abs_x + drawElec.pinSize/2),
        drawElec.positionOnGrid(this.children[1].abs_y)
      );
    },
    end: function () {
      for (var i = drawElec.pinIndicators.length - 1; i >= 0; i--) {
        drawElec.pinIndicators[i].fadeOut(150);
      }
      this.moveTo(
        (drawElec.pinIndicators[0].abs_x + drawElec.pinIndicators[1].abs_x) / 2 - drawElec.pinSize,
        (drawElec.pinIndicators[0].abs_y + drawElec.pinIndicators[1].abs_y) / 2 - drawElec.componentSize.height/2
      );
    }
  };

  this.circuit.addChild(capacitor);
  capacitor.dragAndDrop(dragAndDropOptions);
};

DrawElec.prototype.createElement = function (element) {
  var params = element.params;
  if (element.params==undefined) {
    console.error("params empty in", element);
  }
  params.fill = params.fill || "#3ac";
  params.stroke = params.stroke || "1px #079";

  return this.circuit.display[element.type](params);
};

DrawElec.prototype.createItem = function(description) {
  description.box.fill = description.box.fill || "transparent";
  description.box.stroke = description.box.stroke || "transparent";
  var layer = this.createElement({
    type: "rectangle",
    params: description.box
  });

  for (var element in description.elements) {
    layer.addChild(this.createElement(description.elements[element]));
  }

  return layer;
};

DrawElec.prototype.positionOnGrid = function (position) {
  return Math.round(position/this.baseUnit)*this.baseUnit;
};

DrawElec.prototype.initGrid = function () {
  this.gridEl = document.createElement("canvas");
  this.gridEl.setAttribute('class', 'drawElec-grid');
  this.gridEl.width = window.innerWidth - 22;
  this.gridEl.height = window.innerHeight - 60;
  this.container.appendChild(this.gridEl);
  this.grid = oCanvas.create({
    canvas: this.gridEl
  });


  var background = this.grid.background;
  background.type = "image";
  background.value = "image(img/background.png)";

  var drawElec = this;
  var backgroundImage = new Image();
  backgroundImage.src = "img/background.png";
  backgroundImage.onload = function () {
    var tmpCanvas = document.createElement("canvas");
    tCtx = tmpCanvas.getContext("2d");
    var size = drawElec.baseUnit;
    tmpCanvas.width=size;
    tmpCanvas.height=size;
    tCtx.drawImage(backgroundImage,
                    0,0,
                    backgroundImage.width, backgroundImage.height,
                    0,0,size,size);
    background.bg = background.core.canvas.createPattern(tmpCanvas, "repeat");
    background.loaded = true;
    if (background.core.timeline && !background.core.timeline.running) {
      background.core.redraw(true);
    }
  };
};
