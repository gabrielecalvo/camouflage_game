export class Grid {
  constructor(scaling) {
    this.scaling = scaling;
  }

  attachSprite(gameobj) {
    let worldX = gameobj.game.config.width;
    let worldY = gameobj.game.config.height;
    let bg = gameobj.add.sprite(worldX / 2, worldY / 3, "bg");
    bg.setOrigin(0.5, 0.5);
    bg.setScale(this.scaling, this.scaling);
    bg.areaStart = [
      bg.x - (this.scaling * bg.width) / 2,
      bg.y - (this.scaling * bg.height) / 2,
    ];
    bg.areaEnd = [
      bg.x + (this.scaling * bg.width) / 2,
      bg.y + (this.scaling * bg.height) / 2,
    ];
    this.sprite = bg;
  }

  under(obj) {
    let tol = 20 * this.scaling;
    if (
      (obj.x >= this.sprite.areaStart[0] - tol) &
      (obj.x <= this.sprite.areaEnd[0] + tol) &
      (obj.y >= this.sprite.areaStart[1] - tol) &
      (obj.y <= this.sprite.areaEnd[1] + tol)
    ) {
      return true;
    } else {
      return false;
    }
  }

  snapOver(obj) {
    let [objXmin, objYmin] = this._toULxy(obj, this.scaling);

    objXmin = Phaser.Math.Snap.To(
      objXmin,
      100 * this.scaling,
      this.sprite.areaStart[0]
    );
    objYmin = Phaser.Math.Snap.To(
      objYmin,
      100 * this.scaling,
      this.sprite.areaStart[1]
    );

    [obj.x, obj.y] = this._fromULxy(objXmin, objYmin, obj, this.scaling);
  }

  _toULxy(obj) {
    let W = (this.scaling * obj.width) / 2;
    let H = (this.scaling * obj.height) / 2;
    if (obj.angle % 180 == 0) {
      return [obj.x - W, obj.y - H];
    } else {
      return [obj.x - H, obj.y - W];
    }
  }

  _fromULxy(ULx, ULy, obj) {
    let W = (this.scaling * obj.width) / 2;
    let H = (this.scaling * obj.height) / 2;
    if (obj.angle % 180 == 0) {
      return [ULx + W, ULy + H];
    } else {
      return [ULx + H, ULy + W];
    }
  }
}
