// scene
let gameScene = new Phaser.Scene("Game");
let scaling = 0.8;

function arrEqual(arrA, arrB) {
  if (arrA.length !== arrB.length) return false;
  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) return false;
  }
  return true;
}

// load assests
gameScene.preload = function () {
  this.load.image("grid", "assets/grid.png");
  this.load.image("p1", "assets/p1.png");
  this.load.image("p2", "assets/p2.png");
  this.load.image("p3", "assets/p3.png");
  this.load.image("p4", "assets/p4.png");
  this.load.image("p5", "assets/p5.png");
  this.cameras.main.setBackgroundColor("#DDDDDD");
  this.solution = 0;
};

// create
gameScene.create = function () {
  let worldX = this.game.config.width;
  let worldY = this.game.config.height;

  let grid = this.add.sprite(worldX / 2, worldY / 3, "grid");
  grid.setOrigin(0.5, 0.5);
  grid.setScale(scaling, scaling);
  grid.areaStart = [
    grid.x - (scaling * grid.width) / 2,
    grid.y - (scaling * grid.height) / 2,
  ];
  grid.areaEnd = [
    grid.x + (scaling * grid.width) / 2,
    grid.y + (scaling * grid.height) / 2,
  ];

  let solutionText = this.add.text(
    worldX / 2,
    30,
    "Solve the puzzle to get the password",
    {
      fill: "#000000",
    }
  );
  solutionText.setOrigin(0.5, 0.5);

  let pieces = [];
  const correct_locations = [
    [0, 500],
    [315.6, 182.26666666666665],
    [355.6, 302.26666666666665],
    [395.6, 222.26666666666665],
    [475.6, 142.26666666666665],
    [515.6, 302.26666666666665],
  ];
  const password = "BANANA";

  for (i = 1; i < 6; i++) {
    let piece = this.add.sprite(i * 150, 500, `p${i}`);
    piece.setOrigin(0.5, 0.5);
    piece.setScale(scaling, scaling);
    piece.setInteractive();
    piece.on("pointerup", function (pointer) {
      if (!piece.wasDragged) {
        piece.angle += 90;
      }
      piece.wasDragged = false;
    });
    piece.correct_location = correct_locations[i];
    piece.all = pieces;
    this.input.setDraggable(piece);
    pieces.push(piece);
  }
  pieces.checkSolution = () => {
    console.log("checking solution..");

    console.log(
      pieces.map((o) => {
        return [o.x, o.y];
      })
    );

    function checkPieceLocation(piece) {
      isCorrect = arrEqual(piece.correct_location, [piece.x, piece.y]);
      return isCorrect;
    }

    if (pieces.every(checkPieceLocation)) {
      solutionText.text = `WELL DONE!!! The password is: ${password}`;
    }
  };

  function onGrid(obj) {
    let tol = 20 * scaling;
    if (
      (obj.x >= grid.areaStart[0] - tol) &
      (obj.x <= grid.areaEnd[0] + tol) &
      (obj.y >= grid.areaStart[1] - tol) &
      (obj.y <= grid.areaEnd[1] + tol)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function toULxy(obj) {
    let W = (scaling * obj.width) / 2;
    let H = (scaling * obj.height) / 2;
    if (obj.angle % 180 == 0) {
      return [obj.x - W, obj.y - H];
    } else {
      return [obj.x - H, obj.y - W];
    }
  }

  function fromULxy(ULx, ULy, obj) {
    let W = (scaling * obj.width) / 2;
    let H = (scaling * obj.height) / 2;
    if (obj.angle % 180 == 0) {
      return [ULx + W, ULy + H];
    } else {
      return [ULx + H, ULy + W];
    }
  }

  this.input.dragDistanceThreshold = 10;
  this.input.on("dragstart", function (pointer, obj) {
    obj.wasDragged = true;
    obj.setTint(0xff0000);
  });
  this.input.on("drag", function (pointer, obj, dragX, dragY) {
    obj.x = dragX;
    obj.y = dragY;
  });
  this.input.on("dragend", function (pointer, obj) {
    obj.clearTint();

    if (onGrid(obj)) {
      let [objXmin, objYmin] = toULxy(obj);

      objXmin = Phaser.Math.Snap.To(objXmin, 100 * scaling, grid.areaStart[0]);
      objYmin = Phaser.Math.Snap.To(objYmin, 100 * scaling, grid.areaStart[1]);

      [obj.x, obj.y] = fromULxy(objXmin, objYmin, obj);

      obj.all.checkSolution();
    }
  });
};

// create game
let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1000 * scaling,
  height: 850 * scaling,
  scene: gameScene,
});
