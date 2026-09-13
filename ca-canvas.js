/**
 * CACanvas
 * --------
 * A small helper around an HTML `<canvas>` element for drawing
 * **cellular-automata style grids**.
 *
 * The canvas is divided into a fixed number of rows (set via `ofHeight`),
 * and each "cell" is drawn as a square of `cellSize` pixels. Because
 * `cellSize` is an integer, the grid always tiles the viewport exactly,
 * with no sub-pixel gaps or borders between cells.
 *
 * Coordinate system:
 *   - `x` increases to the right  (column index)
 *   - `y` increases downward      (row index)
 *   - Both are in *grid units*, not pixels. The class multiplies by
 *     `cellSize` internally before drawing.
 *
 * Typical usage:
 *   const ca = new CACanvas(document.getElementById("c"), 60);
 *   ca.resizeAndReset();
 *   ca.drawSquareAt(3, 4, "red");
 */
export default class CACanvas {
  /**
   * @param {HTMLCanvasElement} canvas  The `<canvas>` element to draw on.
   * @param {number} [ofHeight=100]     Target number of rows to fit
   *                                    vertically. Used to derive
   *                                    `cellSize` on resize.
   */
  constructor(canvas, ofHeight = 100) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");

    /**
     * Size of one cell in pixels. Recomputed on every resize.
     * @type {number}
     */
    this.cellSize = 2;

    /**
     * Desired number of rows. Higher = smaller cells = more cells.
     * @type {number}
     */
    this.ofHeight = ofHeight;

    /** @type {number} Number of columns, derived from viewport width. */
    this.cols = 0;

    /** @type {number} Number of rows, derived from viewport height. */
    this.rows = 0;
  }

  /**
   * Recompute the grid to fill the current window, then clear the canvas.
   *
   * Steps:
   *   1. Measure the window.
   *   2. Derive an integer `cellSize` so that exactly `ofHeight` rows fit.
   *   3. Derive `cols` and `rows` from that cell size.
   *   4. Resize the canvas backing store to an exact multiple of `cellSize`.
   *   5. Clear it with the default background.
   *
   * Call this on load and whenever the window resizes.
   */
  resizeAndReset() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Integer cell size → no half-pixel seams between squares.
    // Math.floor here means the grid may be slightly *smaller* than
    // the window rather than overflowing it.
    this.cellSize = Math.floor(height / this.ofHeight);

    this.cols = Math.floor(width / this.cellSize);
    this.rows = Math.floor(height / this.cellSize);

    // Snap the canvas backing store to an exact multiple of cellSize
    // so that `cols * cellSize` fills the canvas edge-to-edge.
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;

    this.clear("#eeeeee");
  }

  /**
   * Fill the whole canvas with a solid colour.
   * @param {string} [backGround="#eeeeee"]  Any CSS colour string.
   */
  clear(backGround = "#eeeeee") {
    this.ctx.fillStyle = backGround;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw a single filled square at grid position (x, y).
   *
   * @param {number}  x                 Column index (grid units).
   * @param {number}  y                 Row index (grid units).
   * @param {string}  [colour="#333333"] Fill colour.
   * @param {boolean} [border=false]    If true, also stroke a light
   *                                    border around the square. Useful
   *                                    when cellSize is large enough
   *                                    that cells would otherwise blur
   *                                    together.
   */
  drawSquareAt(x, y, colour = "#333333", border = false) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize,
    );

    if (border) {
      // Light stroke so neighbouring cells stay visually distinct.
      this.ctx.strokeStyle = "#eeeeee";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        x * this.cellSize,
        y * this.cellSize,
        this.cellSize,
        this.cellSize,
      );
    }
  }

  /**
   * Draw a filled circle centred in grid cell (x, y).
   *
   * The circle is drawn at 1/2.2 of the cell size (slightly smaller than
   * the cell) so it visually "floats" inside its square.
   *
   * @param {number}  x                 Column index (grid units).
   * @param {number}  y                 Row index (grid units).
   * @param {string}  [colour="#333333"] Fill colour.
   * @param {boolean} [border=false]    If true, stroke a light outline.
   */
  drawCircleAt(x, y, colour = "#333333", border = false) {
    // Convert grid coords → pixel coords of the cell centre.
    const centerX = x * this.cellSize + this.cellSize / 2;
    const centerY = y * this.cellSize + this.cellSize / 2;

    const radius = this.cellSize / 2.2;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = colour;
    this.ctx.fill();

    if (border) {
      this.ctx.strokeStyle = "#eeeeee";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  /**
   * Draw an image inside grid cell (x, y).
   *
   * The image is scaled to 80% of the cell and centred, leaving a small
   * margin so images from adjacent cells don't visually merge.
   *
   * Silently does nothing if `img` is falsy (e.g. not yet loaded).
   *
   * @param {number}          x   Column index (grid units).
   * @param {number}          y   Row index (grid units).
   * @param {CanvasImageSource} img  Any drawable image source
   *                                 (HTMLImageElement, ImageBitmap, …).
   */
  drawImageAt(x, y, img) {
    if (img) {
      const imgSize = this.cellSize * 0.8;

      // Centre the image inside the cell.
      const offsetX = (this.cellSize - imgSize) / 2;
      const offsetY = (this.cellSize - imgSize) / 2;

      this.ctx.drawImage(
        img,
        x * this.cellSize + offsetX,
        y * this.cellSize + offsetY,
        imgSize,
        imgSize,
      );
    }
  }
}
