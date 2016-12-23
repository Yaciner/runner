export default class Preload extends Phaser.State {
  preload() {
    this.createPreloader();
    this.load.spritesheet(`submarine`, `assets/img/submarine.png`, 139.5, 107, 5);
    this.load.image(`mine`, `assets/img/mine.png`, 85, 85);
    this.load.atlasJSONHash(`startbutton`, `assets/img/components.png`, `assets/components.json`);
    this.load.atlasJSONHash(`powerups`, `assets/img/powerups.png`, `assets/powerups.json`);
    this.load.spritesheet(`enemysub`, `assets/img/enemy-submarine.png`, 89.5, 86, 4);
    this.load.spritesheet(`enemysub_advanced`, `assets/img/enemy-submarine_advanced.png`, 88.25, 86, 4);
    this.load.spritesheet(`enemysub_boss`, `assets/img/enemy-submarine_boss.png`, 232.5, 118, 4);
    this.load.spritesheet(`explosion`, `assets/img/explosion.png`, 128, 128, 14);
    this.load.image(`bullet`, `assets/img/bullet.png`, 95, 41);
    this.load.image(`rocket`, `assets/img/rocket.png`, 8, 8);
    this.load.image(`watertop`, `assets/img/water-top.png`, 96, 74);
    this.load.image(`layout_highscore`, `assets/img/layout_highscore.png`, 430, 589);
    this.load.image(`layout_gameover`, `assets/img/gameover.png`, 775, 633);
    this.load.image(`background`, `assets/img/background.png`, 1499, 801);
    this.load.image(`fishes`, `assets/img/fishes.png`, 356, 237);
    this.load.image(`big_fish`, `assets/img/big_fish.png`, 123, 82);
    this.load.audio(`generalMusic`, `assets/sounds/general.mp3`);
    this.load.audio(`health`, `assets/sounds/health.wav`);
    this.load.audio(`powerup`, `assets/sounds/powerup.wav`);
    this.load.audio(`powerup`, `assets/sounds/powerup.wav`);
    this.load.audio(`shoot`, `assets/sounds/shoot.mp3`);
    this.load.audio(`enemy_explosion`, `assets/sounds/enemy_explosion.mp3`);
    this.load.audio(`enemy_explosion`, `assets/sounds/enemy_explosion.mp3`);
    this.load.audio(`playerHit`, `assets/sounds/player.wav`);
    this.load.audio(`rocketSound`, `assets/sounds/rocket.wav`);
  }

  createPreloader() {
    this.preloader = this.add.sprite(this.game.width / 2, this.game.height / 2, `preloader`);
    this.preloader.anchor.setTo(0.5, 0.5);
    this.preloader.animations.add(`preload`);
    this.preloader.animations.play(`preload`, 25, true);
  }

  create() {
    this.state.start(`Menu`);
  }
}
