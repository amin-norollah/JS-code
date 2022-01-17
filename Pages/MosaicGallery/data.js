"use strict";

class CreateDatabase {
  constructor(x, y) {
    this._X_length = x >= 5 && x <= 40 ? x : x >= 5 ? 40 : 5;
    this._Y_length = y >= 5 && y <= 40 ? y : y >= 5 ? 40 : 5;
    this._maxTiles = this._X_length * this._Y_length;
    this._availableTile = [];
    this._database = [];
  }

  get Create() {
    this._createTiles();
    return this._database;
  }

  //fill available array with 1
  _fillAvailableMatrix() {
    this._availableTile = [];
    for (let i = 0; i < this._Y_length; i++) {
      const tmp = new Array(this._X_length).fill(1);
      this._availableTile.push(tmp);
    }
  }

  //create database
  _createTiles() {
    let l5 = Math.floor(this._maxTiles / 200);
    let l4 = Math.floor(this._maxTiles / 100);
    let l3 = Math.floor(this._maxTiles / 50);
    let l2 = Math.floor(this._maxTiles / 5);
    let rect = Math.floor(this._maxTiles / 5);

    this._fillAvailableMatrix();
    this._createTile(5, l5);
    this._createTile(4, l4);
    this._createTile(3, l3);
    this._createTile(2, l2);
    this._createTilesRect(rect);
    this._createTilesNormal();
  }

  // create square images
  _createTile(level, num) {
    let count = num * 3;
    while (num > 0 && count > 0) {
      const [positionX, positionY] = [
        Math.floor(Math.random() * (this._X_length - level)),
        Math.floor(Math.random() * (this._Y_length - level)),
      ];

      let en = true;
      mainLoop: for (let i = positionX; i < positionX + level; i++) {
        for (let j = positionY; j < positionY + level; j++) {
          if (this._availableTile[j][i] !== 1) {
            en = false;
            break mainLoop;
          }
        }
      }

      if (en) {
        //new tile
        this._database.push({
          type: `Level-${level}`,
          coordinate: [positionX + 1, positionY + 1],
          imageId: this._database.length % 18,
        });

        //edit available matrix
        for (let i = positionX; i < positionX + level; i++) {
          for (let j = positionY; j < positionY + level; j++) {
            this._availableTile[j][i] = 0;
          }
        }
        num--;
      }
      count--;
    }
  }

  // create rectangle images
  _createTilesRect(rect) {
    let count = rect * 3;
    while (rect > 0 && count > 0) {
      const direction = Math.floor(Math.random() * 1.99);
      const [positionX, positionY] = [
        direction
          ? Math.floor(Math.random() * (this._X_length - 2))
          : Math.floor(Math.random() * (this._X_length - 1)),
        direction
          ? Math.floor(Math.random() * (this._Y_length - 1))
          : Math.floor(Math.random() * (this._Y_length - 2)),
      ];

      let en =
        direction === 1
          ? this._availableTile[positionY][positionX] === 1 &&
            this._availableTile[positionY][positionX + 1] === 1
          : this._availableTile[positionY][positionX] === 1 &&
            this._availableTile[positionY + 1][positionX] === 1;

      if (en) {
        //new tile
        this._database.push({
          type: `rect-${direction}`,
          coordinate: [positionX + 1, positionY + 1],
          imageId: this._database.length % 18,
        });

        //edit available matrix
        if (direction === 1) {
          this._availableTile[positionY][positionX] = 0;
          this._availableTile[positionY][positionX + 1] = 0;
        } else {
          this._availableTile[positionY][positionX] = 0;
          this._availableTile[positionY + 1][positionX] = 0;
        }

        rect--;
      }
      count--;
    }
  }

  // create normal images
  _createTilesNormal() {
    this._availableTile.forEach((itemY, y) => {
      itemY.forEach((itemX, x) => {
        if (itemX === 1) {
          this._database.push({
            type: "normal",
            coordinate: [x + 1, y + 1],
            imageId: this._database.length % 18,
          });
          this._availableTile[y][x] = 0;
        }
      });
    });
  }
}
