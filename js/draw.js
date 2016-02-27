var DrawElec = function (containerSelector) {
	this.container = document.querySelector(containerSelector);
	this.init();
};

DrawElec.prototype.init = function () {
	this.initVariables();
	this.initGrid();
	this.initCircuit();
	this.initItems();
}

DrawElec.prototype.initVariables = function () {
	this.baseUnit = 20;
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
	var pin = this.circuit.display.line({
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 }, 
		stroke: "1px #079",
		cap: "round"
	}), pinIndicators = [];

	pinIndicators[0] = this.circuit.display.ellipse({
		radius: 5,
		x: 13,
		y: 13,
		fill: "rgba(255,0,0,0.6)",
		opacity: 0
	});
	pinIndicators.push(pinIndicators[0].clone());

	for (var i = pinIndicators.length - 1; i >= 0; i--) {
		this.circuit.addChild(pinIndicators[i]);
	}

	var componentModel = {
		width: 40,
		height: 15
	};
	var resistor = this.circuit.display.rectangle({
		x: 50,
		y: 0,
		width: componentModel.width,
		height: componentModel.height,
		fill: "#3ac",
		stroke: "1px #079"
	});
	resistor.addChild(pin.clone({
		start: {
			x: -20,
			y: componentModel.height/2,
		},
		end: {
			x: 0,
			y: componentModel.height/2,
		}
	}));
	resistor.addChild(pin.clone({
		start: {
			x: componentModel.width,
			y: componentModel.height/2,
		},
		end: {
			x: componentModel.width + 20,
			y: componentModel.height/2,
		}
	}));

	var dragAndDropOptions = {
		start: function () {
			for (var i = pinIndicators.length - 1; i >= 0; i--) {
				pinIndicators[i].fadeIn(700);
			};
		},
		move: function () {
			pinIndicators[0].moveTo(
				DrawElec.positionOnGrid(this.children[0].abs_x - 10),
				DrawElec.positionOnGrid(this.children[0].abs_y)
			);
			pinIndicators[1].moveTo(
				DrawElec.positionOnGrid(this.children[1].abs_x + 10),
				DrawElec.positionOnGrid(this.children[1].abs_y)
			);
		},
		end: function () {
			for (var i = pinIndicators.length - 1; i >= 0; i--) {
				pinIndicators[i].fadeOut(150);
			};
			this.moveTo(
				(pinIndicators[0].abs_x + pinIndicators[1].abs_x) / 2 - 20,
				(pinIndicators[0].abs_y + pinIndicators[1].abs_y) / 2 - componentModel.height/2
			);
		}
	};


	var resistors = [ resistor, resistor.clone(), resistor.clone() ];
	for (var i = 0; i < resistors.length; i++) {
		this.circuit.addChild(resistors[i]);
		resistors[i].dragAndDrop(dragAndDropOptions);
	}
};

DrawElec.positionOnGrid = function (position) {
	return Math.round(position/20)*20 - 1;
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

	this.grid.background.set("image(img/background.png)")
};
