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

  subdivions() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    return [
      new Boundary(this.x, this.y, halfWidth, halfHeight), // top left // north west
      new Boundary(this.x + halfWidth, this.y, halfWidth, halfHeight), // top right // north east
      new Boundary(this.x, this.y + halfHeight, halfWidth, halfHeight), // bottom left // south west
      new Boundary(
        this.x + halfWidth,
        this.y + halfHeight,
        halfWidth,
        halfHeight
      ), // bottom right // south east
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

    return (
      this._northWest.insert(item) ||
      this._northEast.insert(item) ||
      this._southWest.insert(item) ||
      this._southEast.insert(item)
    );
  }

  _subdivide() {
    if (!this._subdivided) {
      const quadrantBoundaries = this._boundary.subdivions();

      this._northWest = new QuadTree(quadrantBoundaries[0], this._capacity);
      this._northEast = new QuadTree(quadrantBoundaries[1], this._capacity);
      this._southWest = new QuadTree(quadrantBoundaries[2], this._capacity);
      this._southEast = new QuadTree(quadrantBoundaries[3], this._capacity);

      this._subdivided = true;
    }
  }

  _isNotFull() {
    return this._items.length < this._capacity;
  }
}

function drawQuadTree(quadTree) {
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  rect(
    quadTree._boundary.x,
    quadTree._boundary.y,
    quadTree._boundary.width,
    quadTree._boundary.height
  );

  quadTree._items.forEach((item) => {
    fill(0, 255, 0);
    noStroke();
    ellipse(item.x, item.y, 8, 8);
  });

  if (quadTree._subdivided) {
    drawQuadTree(quadTree._northWest);
    drawQuadTree(quadTree._northEast);
    drawQuadTree(quadTree._southWest);
    drawQuadTree(quadTree._southEast);
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
