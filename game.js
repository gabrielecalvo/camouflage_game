import { PIECES_DATA, BG_DATA, PASSWORD } from "./level.js";
import { Piece } from "./piece.js";
import { Grid } from "./grid.js";

const DEBUG = true;
const SCALING = 0.8;
let PIECES = PIECES_DATA.map((pdata) => new Piece(...pdata));

/////////////////// TEST ///////////////////
if (DEBUG) {
  for (let i = 0; i < PIECES.length; i++) {
    let piece = PIECES[i];
    piece.init_location = piece.correct_location;
    piece.init_angle = 0;
  }
}
////////////////////////////////////////////

// scene
let gameScene = new Phaser.Scene("Game");

// load assests
gameScene.preload = function () {
  this.load.image(...BG_DATA);

  for (let i = 0; i < PIECES.length; i++) {
    let piece = PIECES[i];
    this.load.image(piece.id_, piece.path);
  }

  this.cameras.main.setBackgroundColor("#DDDDDD");
};

// create
gameScene.create = function () {
  // background
  let bg = new Grid(SCALING);
  bg.attachSprite(this);

  // solution text
  let solutionText = this.add.text(
    this.game.config.width / 2,
    30,
    "Solve the puzzle to get the hint",
    {
      fill: "#000000",
    }
  );
  solutionText.setOrigin(0.5, 0.5);

  // piece sprite initialisation
  for (let i = 0; i < PIECES.length; i++) {
    PIECES[i].attachSprite(this, SCALING);
  }

  // dragging configuration
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

    if (bg.under(obj)) {
      bg.snapOver(obj);

      let piece = PIECES.filter((p) => p.sprite === obj)[0];
      console.log(
        piece.id_,
        piece.checkSolution(),
        piece.getCurrentLocation(),
        piece.correct_location
      );
      if (PIECES.every((p) => p.checkSolution())) {
        // PIECES.forEach((piece) => {
        //   // showing current locations
        //   console.log(piece.id_, piece.getCurrentLocation());
        // });
        solutionText.text = `WELL DONE!!! The hint is: ${PASSWORD}`;
      }
    }
  });
};

// create game
let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1000 * SCALING,
  height: 850 * SCALING,
  scene: gameScene,
});
