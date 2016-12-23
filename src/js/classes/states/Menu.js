import Button from '../objects/Button';

export default class Menu extends Phaser.State {
  create() {
    //For the moment
    this.createBackground();
    this.createButton();
    this.createLeaderboardButton();
    this.createMusic();
  }

  startClick() {
    this.state.start(`Play`);
  }

  leaderBoardClick() {
    this.state.start(`Leaderboard`);
  }

  createLeaderboardButton() {
    const leaderboardButton = new Button(this.game, this.world.centerX, this.world.centerY + 200, this.leaderBoardClick, this, `blue`, `Leaderboard`);
    leaderboardButton.anchor.setTo(0.5, 0.5);
    this.add.existing(leaderboardButton);
    this.titleText = this.add.text(
      this.game.width / 2, 200, `Submarine adventure`,
        {font: `60px oil_can`, fill: `#fff`, align: `center`});
    this.titleText.anchor.setTo(0.5, 0.5);
  }

  createBackground() {
    this.backgroundimage = this.add.sprite(0, 0, `background`);
    this.backgroundTop = this.add.tileSprite(0, 0, this.game.width, 74, `watertop`);
    this.backgroundTop.autoScroll(- 100, 0);
  }

  createButton() {
    const playButton = new Button(this.game, this.world.centerX, this.world.centerY, this.startClick, this, `green`, `Play`);
    playButton.anchor.setTo(0.5, 0.5);
    this.add.existing(playButton);
  }

  createMusic() {
    if (!this.generalMusic) {
      this.generalMusic = this.add.sound(`generalMusic`, 1, 1);
      this.generalMusic.play();
    }

  }
}
