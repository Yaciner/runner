export default class Obstacle extends Phaser.Sprite {
  constructor(game, x, y, frame) {
    super(game, x, y, `obstakel`, frame);
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.outOfBoundsKill = true;
    this.body.velocity.x = - 1000;  }
}
