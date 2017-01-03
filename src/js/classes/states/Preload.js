export default class Preload extends Phaser.State {
  preload() {
    this.createPreloader();
  }

  createPreloader() {
    this.preloader = this.add.sprite(this.game.width / 2, this.game.height / 2, `preloader`);
    this.preloader.anchor.setTo(0.5, 0.5);
    this.preloader.animations.add(`preload`);
    this.preloader.animations.play(`preload`, 30, true);
    this.load.atlasJSONHash(`player`, `../assets/img/spritesheet.png`, `../assets/img/sprites.json`);
    this.load.image(`obstakel`, `assets/img/obstakel.png`, 98, 213);
    this.load.image(`loopveld`, `assets/img/loopveld.png`, 1100, 258);
  }

  create() {
    this.state.start(`Play`);
  }
}
