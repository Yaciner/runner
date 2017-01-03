export default class Ninja extends Phaser.Sprite {
  /* eslint-disable */
  constructor(game, x, y) {
    /* eslint-enable */
    super(game, x, y, `player`);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.scale.setTo(0.5, 0.5);
    this.anchor.setTo(0.5, 1);

    this.animations.add(`run`, [`Run__000`, `Run__001`, `Run__002`, `Run__003`,
      `Run__004`, `Run__005`, `Run__006`, `Run__007`, `Run__008`, `Run__009`], 30, true, false);

    this.animations.add(`jump`, [`Jump__000`, `Jump__001`, `Jump__002`, `Jump__003`,
      `Jump__004`, `Jump__005`, `Jump__006`, `Jump__007`, `Jump__008`, `Jump__009`], 13, false, false);

    this.body.setSize(363, 448, 0, 0);
    this.health = 3;
    this.animations.play(`run`);
  }

  jump() {
    this.animations.play(`jump`);
  }
}
