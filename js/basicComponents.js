(function (window) {
  var BasicComponents = function (unit) {
    var _this=this;
    this.unit = unit;
    this.componentSize = {
      width: 3 * this.unit,
      height: 0.75 * this.unit
    };
    this.components = [];
    this.components.resistor = {
      box: function (x, y) {
        return {
          x: x * _this.unit,
          y: y * _this.unit - _this.componentSize.height / 2,
          width: _this.componentSize.width,
          height: _this.componentSize.height
        };
      },
      item: function (box) {
        return {
          box: box,
          elements: [
            {
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
            }
          ],
          plugs: [
            {
              x: box.width,
              y: 0.5 * box.height
            }, {
              x: 0,
              y: 0.5 * box.height
            }
          ]
        };
      }
    };
    this.components.capacitor = {
      box: function (x, y) {
        return {
          x: x * _this.unit,
          y: y * _this.unit - _this.componentSize.height / 2,
          width: _this.componentSize.width,
          height: _this.componentSize.height
        };
      },
      item: function (box) {
        return {
          box: box,
          elements: [{
            // first plate
            type: "line",
            params: {
              start: {
                x: 0.45 * box.width,
                y: -0.2 * box.height
              },
              end: {
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
                y: -0.2 * box.height
              },
              end: {
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
          }],
          plugs: [
            {
              x: box.width,
              y: 0.5 * box.height
            }, {
              x: 0,
              y: 0.5 * box.height
            }
          ]
        };
      }
    };
  };

  BasicComponents.prototype.get = function () {
    return this.components;
  };

  window.BasicComponents = BasicComponents;
}(window));