/**
 * cellular-automata.js
 * --------------------
 * Minimal building blocks for a 2D cellular automaton on a toroidal
 * (wrap-around) grid.
 *
 * Three classes:
 *   - {@link Agent}  — something that lives in a {@link Cell}.
 *   - {@link Cell}   — a grid position; knows its neighbours and occupant.
 *   - {@link Grid}   — owns all cells; wires up the neighbour graph.
 *
 * Coordinate convention throughout: `x` = column, `y` = row, both starting
 * at 0 in the top-left. Neighbourhood is the **Moore neighbourhood** (8
 * surrounding cells), and edges wrap around (torus topology).
 */

/**
 * Base class for anything that can occupy a {@link Cell}.
 *
 * Subclasses (e.g. `Prisoner`) typically add their own state and
 * per-generation behaviour. `Agent` itself only knows:
 *   - which cell it lives in (`home`), and
 *   - a single `state` value that it can get/set.
 */
export class Agent {
  /**
   * Create an agent and place it in `home`.
   *
   * Side effect: calls `home.setOccupant(this)` so the cell immediately
   * points back at this agent. That means you normally do **not** need to
   * call `cell.setOccupant(agent)` yourself after construction.
   *
   * @param {Cell} home  The cell this agent lives in.
   */
  constructor(home) {
    /** @type {Cell} */
    this.home = home;

    // Self-register with the host cell.
    home.setOccupant(this);
  }

  /**
   * Set this agent's state.
   *
   * The base class treats state as an opaque value (string, number,
   * object, …). Subclasses are free to redefine what "state" means.
   *
   * @param {*} state
   */
  setState(state) {
    this.state = state;
  }
}

/**
 * A single position on the grid.
 *
 * A cell knows:
 *   - its own (x, y) coordinates,
 *   - at most one {@link Agent} occupant (or `null`),
 *   - references to its neighbours (populated by {@link Grid#setNeighbours}).
 *
 * Cells do not know about the grid as a whole; the grid wires them up.
 */
export class Cell {
  /**
   * @param {number} xpos  Column index.
   * @param {number} ypos  Row index.
   */
  constructor(xpos, ypos) {
    /** @type {number} */
    this.xpos = xpos;

    /** @type {number} */
    this.ypos = ypos;

    /**
     * The agent currently in this cell, or `null` if empty.
     * @type {Agent|null}
     */
    this.occupant = null;

    /**
     * Adjacent cells. Filled in by {@link Grid#setNeighbours}.
     * @type {Cell[]}
     */
    this.neighbours = [];
  }

  /**
   * Register `cell` as a neighbour of this cell.
   * @param {Cell} cell
   */
  addNeighbour(cell) {
    this.neighbours.push(cell);
  }

  /**
   * @returns {Agent|null} The current occupant, or `null`.
   */
  getOccupant() {
    return this.occupant;
  }

  /**
   * Replace the current occupant. Pass `null` to vacate the cell.
   * @param {Agent|null} occupant
   */
  setOccupant(occupant) {
    this.occupant = occupant;
  }
}

/**
 * A 2D grid of {@link Cell}s with **toroidal** (wrap-around) topology.
 *
 * Construction immediately:
 *   1. creates all cells, then
 *   2. links each cell to its 8 Moore neighbours.
 *
 * Wrapping means a cell on the top edge is neighbours with cells on the
 * bottom edge, and likewise left/right. This avoids edge artefacts in
 * simulations like the spatial Prisoner's Dilemma.
 */
export default class Grid {
  /**
   * @param {number} cols  Number of columns.
   * @param {number} rows  Number of rows.
   */
  constructor(cols, rows) {
    /** @type {number} */
    this.cols = cols;

    /** @type {number} */
    this.rows = rows;

    /**
     * Row-major storage: `cells[y][x]` is the cell at column `x`, row `y`.
     * @type {Cell[][]}
     */
    this.cells = [];

    this.init();
  }

  /**
   * Wrap an x-coordinate into `[0, cols)`.
   *
   * Handles negative inputs too, because JavaScript's `%` can return
   * negative results: `(-1 + cols) % cols` → `cols - 1`.
   *
   * @param {number} x
   * @returns {number}
   */
  xBounds(x) {
    return (x + this.cols) % this.cols;
  }

  /**
   * Wrap a y-coordinate into `[0, rows)`.
   * @param {number} y
   * @returns {number}
   */
  yBounds(y) {
    return (y + this.rows) % this.rows;
  }

  /**
   * Allocate every cell, then wire up neighbours.
   *
   * Called automatically from the constructor; you shouldn't need to call
   * it directly unless you want to reset the grid in place.
   */
  init() {
    for (let y = 0; y < this.rows; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.cols; x++) {
        // The third argument is ignored by Cell's constructor, but
        // harmless — kept as-is to match the original code.
        this.cells[y][x] = new Cell(x, y, "");
      }
    }
    this.setNeighbours();
  }

  /**
   * For every cell, add its 8 surrounding cells as neighbours.
   *
   * Iterates `yy`/`xx` over the 3×3 block centred on `(x, y)`, wraps each
   * coordinate through the torus, and skips the centre cell itself.
   *
   * Complexity: O(rows × cols × 9).
   */
  setNeighbours() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        for (let yy = y - 1; yy <= y + 1; yy++) {
          let yyy = this.yBounds(yy);
          for (let xx = x - 1; xx <= x + 1; xx++) {
            let xxx = this.xBounds(xx);

            // Skip the cell itself.
            if (yyy === y && xxx === x) {
              continue;
            }

            this.cells[y][x].addNeighbour(this.cells[yyy][xxx]);
          }
        }
      }
    }
  }

  /**
   * Convenience accessor. Note the argument order: **(y, x)**, matching
   * row-major indexing, not the usual (x, y) you might expect.
   *
   * @param {number} y  Row index.
   * @param {number} x  Column index.
   * @returns {Cell}
   */
  getCell(y, x) {
    return this.cells[y][x];
  }
}
