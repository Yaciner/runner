export default class Boot extends Phaser.State {
  preload() {
    this.stage.backgroundColor = `#ffffff`;
    this.load.spritesheet(`preloader`, `assets/img/preloader.png`, 120, 20);
  }
  create() {
    this.state.start(`Preload`);
  }
}
