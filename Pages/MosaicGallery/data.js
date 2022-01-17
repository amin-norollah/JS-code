"use strict";

class CreateDatabase {
  constructor(x, y) {
    this.X_length = x >= 5 && x <= 40 ? x : x >= 5 ? 40 : 5;
    this.Y_length = y >= 5 && y <= 40 ? y : y >= 5 ? 40 : 5;
    this.maxTiles = this.X_length * this.Y_length;
    this.availableTile = [];
    this.database = [];
  }

  get Create() {
    this.CreateTiles();
    return this.database;
  }

  //fill available array with 1
  FillAvailableMatrix() {
    this.availableTile = [];
    for (let i = 0; i < this.Y_length; i++) {
      const tmp = new Array(this.X_length).fill(1);
      this.availableTile.push(tmp);
    }
  }

  //create database
  CreateTiles() {
    let l5 = Math.floor(this.maxTiles / 200);
    let l4 = Math.floor(this.maxTiles / 100);
    let l3 = Math.floor(this.maxTiles / 50);
    let l2 = Math.floor(this.maxTiles / 5);
    let rect = Math.floor(this.maxTiles / 5);

    this.FillAvailableMatrix();
    this.CreateTile(5, l5);
    this.CreateTile(4, l4);
    this.CreateTile(3, l3);
    this.CreateTile(2, l2);
    this.CreateTilesRect(rect);
    this.CreateTilesNormal();
  }

  // create square images
  CreateTile(level, num) {
    let count = num * 3;
    while (num > 0 && count > 0) {
      const [positionX, positionY] = [
        Math.floor(Math.random() * (this.X_length - level)),
        Math.floor(Math.random() * (this.Y_length - level)),
      ];

      let en = true;
      mainLoop: for (let i = positionX; i < positionX + level; i++) {
        for (let j = positionY; j < positionY + level; j++) {
          if (this.availableTile[j][i] !== 1) {
            en = false;
            break mainLoop;
          }
        }
      }

      if (en) {
        //new tile
        this.database.push({
          type: `Level-${level}`,
          coordinate: [positionX + 1, positionY + 1],
          imageId: this.database.length % 18,
        });

        //edit available matrix
        for (let i = positionX; i < positionX + level; i++) {
          for (let j = positionY; j < positionY + level; j++) {
            this.availableTile[j][i] = 0;
          }
        }
        num--;
      }
      count--;
    }
  }

  // create rectangle images
  CreateTilesRect(rect) {
    let count = rect * 3;
    while (rect > 0 && count > 0) {
      const direction = Math.floor(Math.random() * 1.99);
      const [positionX, positionY] = [
        direction
          ? Math.floor(Math.random() * (this.X_length - 2))
          : Math.floor(Math.random() * (this.X_length - 1)),
        direction
          ? Math.floor(Math.random() * (this.Y_length - 1))
          : Math.floor(Math.random() * (this.Y_length - 2)),
      ];

      let en =
        direction === 1
          ? this.availableTile[positionY][positionX] === 1 &&
            this.availableTile[positionY][positionX + 1] === 1
          : this.availableTile[positionY][positionX] === 1 &&
            this.availableTile[positionY + 1][positionX] === 1;

      if (en) {
        //new tile
        this.database.push({
          type: `rect-${direction}`,
          coordinate: [positionX + 1, positionY + 1],
          imageId: this.database.length % 18,
        });

        //edit available matrix
        if (direction === 1) {
          this.availableTile[positionY][positionX] = 0;
          this.availableTile[positionY][positionX + 1] = 0;
        } else {
          this.availableTile[positionY][positionX] = 0;
          this.availableTile[positionY + 1][positionX] = 0;
        }

        rect--;
      }
      count--;
    }
  }

  // create normal images
  CreateTilesNormal() {
    this.availableTile.forEach((itemY, y) => {
      itemY.forEach((itemX, x) => {
        if (itemX === 1) {
          this.database.push({
            type: "normal",
            coordinate: [x + 1, y + 1],
            imageId: this.database.length % 18,
          });
          this.availableTile[y][x] = 0;
        }
      });
    });
  }
}
