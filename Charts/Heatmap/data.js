"use strict";

class CreateDatabase {
  constructor(x, y, [limitLow, limitHigh], variation = 1) {
    this._X_length =
      x >= limitLow && x <= limitHigh
        ? x
        : x >= limitLow
        ? limitHigh
        : limitLow;
    this._Y_length =
      y >= limitLow && y <= limitHigh
        ? y
        : y >= limitLow
        ? limitHigh
        : limitLow;
    this.var = variation;
    this._maxTiles = this._X_length * this._Y_length;
    this._availableTile = [];
    this._database = [];
  }

  get Create() {
    this._createTiles();
    return this._database;
  }

  _randomNum(low, high) {
    return low + Math.abs(high - low) * Math.random();
  }

  _randomNumSquare(value) {
    return -1 * value + Math.abs(2 * value) * Math.random();
  }

  //create a cluster of items
  _createClusterItems(Value) {
    const AvgX = this._X_length / 2;
    const AvgY = this._Y_length / 2;

    const tmp = {
      data: new Array(this._Y_length).fill([]).map((_, Y) => {
        return new Array(this._X_length).fill([]).map((_, X) => {
          // the actual formula is : 1- (x-avg_x/avg_x)^2
          // variation change the position of maximum data
          // as a result, if the input is close to the mean, the output would be bigger
          const factorX =
            1 -
            Math.pow((X - AvgX + this._randomNumSquare(this.var)) / AvgX, 2);
          const factorY = 1 - Math.pow((Y - AvgY) / AvgY, 2);

          return {
            coordinate: { x: X + 1, y: Y + 1 },
            value: ((factorX + factorY) / 2) * Value,
          };
        });
      }),
      value: Value,
    };
    return tmp;
  }

  //create database
  _createTiles() {
    this._database = this._createClusterItems(this._randomNum(350, 511));
    // console.log(this._database);
  }
}
