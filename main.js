class Boundary {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(item) {
    return (
      item.x >= this.x &&
      item.x <= this.x + this.width &&
      item.y >= this.y &&
      item.y <= this.y + this.height
    );
  }

  _topLeft() {
    return new Boundary(this.x, this.y, this.width / 2, this.height / 2);
  }

  _topRight() {
    return new Boundary(
      this.x + this.width / 2,
      this.y,
      this.width / 2,
      this.height / 2
    );
  }

  _bottomLeft() {
    return new Boundary(
      this.x,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2
    );
  }

  _bottomRight() {
    return new Boundary(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2
    );
  }

  subdivisions() {
    return [
      this._topLeft(),
      this._topRight(),
      this._bottomLeft(),
      this._bottomRight(),
    ];
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this._boundary = boundary;
    this._capacity = capacity;
    this._items = [];
    this._subdivided = false;
  }

  insert(item) {
    if (!this._boundary.contains(item)) {
      return false;
    }

    if (this._isNotFull()) {
      this._items.push(item);
      return true;
    }

    this._subdivide();

    return this._quadrants.find((quadrant) => quadrant.insert(item));
  }

  _subdivide() {
    if (!this._subdivided) {
      const makeQuadTreeFromBoundary = (boundary) => {
        return new QuadTree(boundary, this._capacity);
      };

      this._quadrants = this._boundary
        .subdivisions()
        .map(makeQuadTreeFromBoundary);

      this._subdivided = true;
    }
  }

  _isNotFull() {
    return this._items.length < this._capacity;
  }
}

function drawQuadTree(quadTree) {
  // first draw boundary
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  rect(
    quadTree._boundary.x,
    quadTree._boundary.y,
    quadTree._boundary.width,
    quadTree._boundary.height
  );

  // now draw points
  quadTree._items.forEach((item) => {
    fill(0, 255, 0);
    noStroke();
    ellipse(item.x, item.y, 8, 8);
  });

  // recursively draw subquadrants
  if (quadTree._subdivided) {
    quadTree._quadrants.forEach(drawQuadTree);
  }
}

let quadTree;

function setup() {
  createCanvas(640, 480);
  quadTree = new QuadTree(new Boundary(0, 0, 640, 480), 4);
  background(125);
}

function draw() {}

function mousePressed() {
  quadTree.insert({ x: mouseX, y: mouseY });
  background(125);
  drawQuadTree(quadTree);
}
