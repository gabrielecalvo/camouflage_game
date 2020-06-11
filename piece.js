export class Piece {
  constructor(
    id_,
    path,
    correct_location,
    correct_angle,
    init_location,
    init_angle
  ) {
    this.id_ = id_;
    this.path = path;
    this.correct_location = correct_location;
    this.correct_angle = correct_angle;
    this.init_location = init_location;
    this.init_angle = init_angle;
    this.sprite = null;
  }

  getCurrentLocation() {
    return [this.sprite.x, this.sprite.y];
  }

  checkSolution() {
    let loc = this.getCurrentLocation();
    if (
      (loc[0].toFixed(2) == this.correct_location[0].toFixed(2)) &
      (loc[1].toFixed(2) == this.correct_location[1].toFixed(2)) &
      (this.correct_angle === null
        ? true
        : this.sprite.angle == this.correct_angle)
    ) {
      return true;
    }
    return false;
  }

  attachSprite(gameobj, scaling) {
    let sprite = gameobj.add.sprite(
      this.init_location[0],
      this.init_location[1],
      this.id_
    );
    sprite.setOrigin(0.5, 0.5);
    sprite.setScale(scaling, scaling);
    sprite.setInteractive();
    sprite.angle = this.init_angle;
    sprite.on("pointerup", function (pointer) {
      if (!sprite.wasDragged) {
        sprite.angle += 90;
      }
      sprite.wasDragged = false;
    });
    sprite.correct_location = this.correct_location;
    gameobj.input.setDraggable(sprite);
    this.sprite = sprite;
  }
}
