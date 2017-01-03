import Player from '../objects/Player';
import Obstacle from '../objects/Obstacle';

let SPEED = 2000;
const GRAVITY = 1500;

export default class Play extends Phaser.State {
  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = GRAVITY;
    this.createBackground();
    this.createPlayer();
    this.obstacleGenerator = this.time.events.loop(SPEED, this.generateObstacle, this);
    this.obstacleGenerator.timer.start();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceButton.onDown.add(this.spaceDown, this);
  }

  createBackground() {
    this.stage.backgroundColor = `#a3cec1`;
    this.loopveld = this.add.image(0, this.game.height - 260, `loopveld`);
    this.loopveld.enableBody = true;
    this.loopveld.physicsBodyType = Phaser.Physics.ARCADE;
    this.loopveld.body.setSize(0, 0, 0, 0);
  }

  createPlayer() {
    this.player = new Player (this.game, 100, this.game.height / 2 + 290);
    this.add.existing(this.player);
  }

  generateObstacle() {
    this.obstacle = new Obstacle(this.game, this.game.width, this.game.height / 2 + 190);
    this.add.existing(this.obstacle);
    this.addSpeed();
  }

  render() {
    this.game.debug.body(this.loopveld);
    this.game.debug.body(this.player);
  }


  addSpeed() {
    if (SPEED > 500) {
      SPEED = SPEED - 100;
    }
    this.game.time.events.remove(this.obstacleGenerator);
    this.obstacleGenerator = this.time.events.loop(SPEED, this.generateObstacle, this);
  }
  spaceDown() {
    this.player.body.velocity.y = - 600;
    this.player.jump();
    this.player.events.onAnimationComplete.add(e => {
      e.play(`run`);
    }, this);
  }
  update() {
    this.physics.arcade.collide(this.player, this.loopveld);
  }
}
