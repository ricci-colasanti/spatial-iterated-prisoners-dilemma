export class Agent{
  constructor(home) {
    this.home = home;
  }
  setState(state) {
    this.state = state;
  }
}

export class Cell {
  static now = 0;
  static next = 1;

  constructor(xpos, ypos) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.occupant = [null,null];
    this.neighbours = [];
  }

  addNeighbour(cell) {
    this.neighbours.push(cell);
  }

  getOccupant() {
    return this.occupant[Cell.now];
  }

  setOccupantNow(occupant) {
    this.occupant[Cell.now]=occupant;
  }

  setOccupantNext(occupant) {
    this.occupant[Cell.now]=occupant;
  }
}

export default class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
    this.init();
  }

  xBounds(x) {
    return (x + this.cols) % this.cols;
  }

  yBounds(y) {
    return (y + this.rows) % this.rows;
  }

  init() {
    for (let y = 0; y < this.rows; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.cells[y][x] = new Cell(x, y, "");
      }
    }
  }

  setNeighbours() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        for (let yy = y - 1; yy <= y + 1; yy++) {
          let yyy = this.yBounds(yy);
          for (let xx = x - 1; xx <= x + 1; xx++) {
            let xxx = this.xBounds(xx);
            if (yyy === y && xxx === x) {
              continue;
            }
            this.cells[y][x].addNeighbour(this.cells[yyy][xxx]);
          }
        }
      }
    }
  }

  getCell(y, x) {
    return this.cells[y][x];
  }
}
