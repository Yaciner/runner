export default class Boot extends Phaser.State {
  preload() {
    this.load.spritesheet(`preloader`, `assets/img/preloader.png`, 188, 188, 48);
  }
  create() {
    this.state.start(`Preload`);
  }
}
