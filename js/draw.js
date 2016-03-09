(function (window, oCanvas) {
    var DrawElec = function (containerSelector) {
      this.container = document.querySelector(containerSelector);
      this.init();
    };

  DrawElec.prototype.init = function () {
    this.initSizes();
    this.initGrid();
    this.initCircuit();
    this.initItems();
  };

  DrawElec.prototype.initSizes = function () {
    this.baseUnit = 20;
    this.components = (new window.BasicComponents(this.baseUnit)).get();
  };

  DrawElec.prototype.initCircuit = function () {
    this.circuitEl = document.createElement("canvas");
    this.circuitEl.setAttribute("class", "drawElec-circuit");
    this.circuitEl.width = window.innerWidth - 22;
    this.circuitEl.height = window.innerHeight - 60;
    this.container.appendChild(this.circuitEl);

    this.circuit = oCanvas.create({
      canvas: this.circuitEl
    });
  };

  DrawElec.prototype.initItems = function () {
    this.pinIndicators = [];

    this.draw("resistor", 4, 3);
    this.draw("capacitor", 4, 4);
    this.draw("resistor", 4, 5);
  };

  DrawElec.prototype.addIndicator = function () {
    var newIndicator = this.circuit.display.ellipse({
      radius: 5,
      x: 13,
      y: 13,
      fill: "rgba(255,0,0,0.6)",
      opacity: 0
    }), newNumberOfIndicators = this.pinIndicators.push(newIndicator);
    this.circuit.addChild(this.pinIndicators[newNumberOfIndicators - 1]);
  };

  DrawElec.prototype.draw = function (componentType, x, y) {
    var componentFactory = this.components[componentType],
      componentBox = componentFactory.box(x, y),
      component = this.createItem(componentFactory.item(componentBox));
    this.addElementToCircuit(component);
  };

  DrawElec.prototype.indicatePlugsOfElement = function (element) {
    var i;
    for (i in element.desc.plugs) {
      if (this.pinIndicators.length - 1 < i) {
        this.addIndicator();
      }
      this.pinIndicators[i].fadeIn(700);
      this.pinIndicators[i].moveTo(
        this.positionOnGrid(element.abs_x + element.desc.plugs[i].x),
        this.positionOnGrid(element.abs_y + element.desc.plugs[i].y)
      );
    }
  };

  DrawElec.prototype.moveElementToIndicators = function (element) {
    element.moveTo(
      this.pinIndicators[0].abs_x - element.desc.plugs[0].x,
      this.pinIndicators[0].abs_y - element.desc.plugs[0].y
    );
  };

  DrawElec.prototype.hideIndicators = function () {
    var i;
    for (i = this.pinIndicators.length - 1; i >= 0; i--) {
      this.pinIndicators[i].fadeOut("normal", "ease-in-out-cubic");
    }
  };

  DrawElec.prototype.addElementToCircuit = function (element) {
    var drawElec = this,
      dragAndDropOptions = {
        start: function () {
          drawElec.indicatePlugsOfElement(element);
        },
        move: function () {
          drawElec.indicatePlugsOfElement(element);
        },
        end: function () {
          drawElec.moveElementToIndicators(element);
        }
      };

    this.circuit.addChild(element);
    element.dragAndDrop(dragAndDropOptions);
  };

  DrawElec.prototype.createElement = function (element) {
    var params = element.params;
    params.fill = params.fill || "#3ac";
    params.stroke = params.stroke || "1px #079";

    return this.circuit.display[element.type](params);
  };

  DrawElec.prototype.createItem = function (description) {
    var element, layer;
    description.box.fill = description.box.fill || "transparent";
    description.box.stroke = description.box.stroke || "transparent";
    layer = this.createElement({
      type: "rectangle",
      params: description.box
    });

    for (element in description.elements) {
      layer.addChild(this.createElement(description.elements[element]));
    }

    layer.desc = description;

    return layer;
  };

  DrawElec.prototype.positionOnGrid = function (position) {
    return Math.round(position / this.baseUnit) * this.baseUnit;
  };

  DrawElec.prototype.initGrid = function () {
    this.gridEl = document.createElement("canvas");
    this.gridEl.setAttribute("class", "drawElec-grid");
    this.gridEl.width = window.innerWidth - 22;
    this.gridEl.height = window.innerHeight - 60;
    this.container.appendChild(this.gridEl);
    this.grid = oCanvas.create({
      canvas: this.gridEl
    });


    var background = this.grid.background,
      drawElec = this,
      backgroundImage = new Image();
    background.type = "image";
    background.value = "image(img/background.png)";
    backgroundImage.src = "img/background.png";
    backgroundImage.onload = function () {
      var tmpCanvas = document.createElement("canvas"),
        size = drawElec.baseUnit,
        tCtx = tmpCanvas.getContext("2d");
      tmpCanvas.width = size;
      tmpCanvas.height = size;
      tCtx.drawImage(backgroundImage,
        0, 0,
        backgroundImage.width, backgroundImage.height,
        0, 0, size, size);
      background.bg = background.core.canvas.createPattern(tmpCanvas, "repeat");
      background.loaded = true;
      if (background.core.timeline && !background.core.timeline.running) {
        background.core.redraw(true);
      }
    };
  };

  window.DrawElec = DrawElec;
}(window, oCanvas));