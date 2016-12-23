const PLAYER_VELOCITY_Y = 300;
const PLAYER_VELOCITY_X = 400;
const PLAYER_EXTRA_LIVES = 3;
const MINE_SPAWN_INTERVAL = 3000;
const MINE_BODY_VELOCITY_Y = 100;
const PLAYER_GHOST_TIME = 500;
const BULLET_VELOCITY = 600;
const LIFE_BOOST_SPAWN_INTERVAL = 16000;
const LIFE_BOOST_GRAVITY_Y = 20;
const POWER_UP_GRAVITY_Y = 25;
const POWER_UP_SPAWN_INTERVAL = 20000;
const POWER_UP_TIME = 5000;
const ENEMY_SPAWN_TIME = 2000;

const startDate = new Date();

const created = `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`;
const date = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getUTCDate()}`;
let delay = 10;
let sprayPowerUp = 0;
let rocketPowerUp = 0;
const form = document.querySelector(`.scoreForm`);
const formData = document.querySelector(`.dataForm`);

const regular = {
  frameName: `enemysub`,
  hitPoints: 1,
  scorePoints: 10,
  velocity: 300
};

const advanced = {
  frameName: `enemysub_advanced`,
  hitPoints: 3,
  scorePoints: 20,
  velocity: 150
};

const boss = {
  frameName: `enemysub_boss`,
  hitPoints: 10,
  scorePoints: 100,
  velocity: 75
};

const ENEMY_TYPES = [
  regular,
  advanced,
  boss
];


import Player from '../objects/Player';
import Mine from '../objects/Mine';
import Enemy from '../objects/Enemy';
import Bullet from '../objects/Bullet';
import Rocket from '../objects/Rocket';
import LifeBoost from '../objects/LifeBoost';
import PowerUp from '../objects/PowerUp';
import GameOver from '../objects/GameOver';

export default class Play extends Phaser.State {
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createBackground();
    this.createPlayer();
    this.createEnemies();
    this.createMines();
    this.createScoreText();
    this.createLifeIcons();
    this.createBullets();
    this.createRockets();
    this.createExplosions();
    this.createLifeBoosts();
    this.createPowerUps();
    this.createSounds();
  }

  createBackground() {
    this.backgroundimage = this.add.sprite(0, 0, `background`);
    this.backgroundTop = this.add.tileSprite(0, 0, this.game.width, 74, `watertop`);
    this.backgroundTop.autoScroll(- 100, 0);
  }

  createPlayer() {
    this.player = new Player (this.game, 100, this.game.height / 2);
    this.add.existing(this.player);
  }

  createEnemies() {
    this.enemiesRegular = this.add.group();
    this.enemiesAdvanced = this.add.group();
    this.enemiesBoss = this.add.group();
    this.enemyRegGenerator = this.time.events.loop(ENEMY_SPAWN_TIME, this.generateRegEnemies, this);
  }

  createMines() {
    this.mines = this.add.group();
    this.mineSpawnTimer = this.time.events.loop(MINE_SPAWN_INTERVAL, this.spawnMine, this);
  }

  createBullets() {
    this.bullets = new Bullet(this.game);
    this.nextShotAt = 0;
    this.shotDelay = 300;
  }

  createSounds() {
    this.healthSound = this.add.sound(`health`, 0.6, 0);
    this.powerUpSound = this.add.sound(`powerup`, 0.6, 0);
    this.playerHitSound = this.add.sound(`playerHit`, 0.6, 0);
    this.shootSound = this.add.sound(`shoot`, 0.4, 0);
    this.rocketSound = this.add.sound(`rocketSound`, 0.4, 0);
    this.enemyExplosionSound = this.add.sound(`enemy_explosion`, 0.6, 0);
  }

  createRockets() {
    this.rockets = new Rocket(this.game);
    this.nextShotAt = 0;
    this.shotDelay = 300;
  }

  createScoreText() {
    this.score = 0;
    this.scoreText = this.add.text(
      this.game.width / 2, 40, `${this.score}`,
      {font: `40px Impact`, fill: `#fff`, align: `center`}
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
  }

  createLifeIcons() {
    this.lifeIcons = this.add.group();
    const firstLifeIconX = this.game.width - (PLAYER_EXTRA_LIVES * 80);
    for (let i = 0;i < PLAYER_EXTRA_LIVES;i ++) {
      const life = this.lifeIcons.create(firstLifeIconX + (80 * i), 30, `submarine`);
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
  }

  createLifeBoosts() {
    this.lifeBoosts = this.add.group();
    this.lifeBoostGenerator = this.time.events.loop(LIFE_BOOST_SPAWN_INTERVAL, this.generateLifeBoost, this);
  }

  createPowerUps() {
    this.powerUps = this.add.group();
    this.powerUpUntil = 0;
    this.powerUpGenerator = this.time.events.loop(POWER_UP_SPAWN_INTERVAL, this.generatePowerUp, this);
  }

  createExplosions() {
    this.explosions = this.add.group();
    this.explosions.enableBody = true;
    this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosions.createMultiple(100, `explosion`);
    this.explosions.setAll(`anchor.x`, 0.5);
    this.explosions.setAll(`anchor.y`, 0.5);
    this.explosions.forEach(explosion => {
      explosion.animations.add(`boom`);
    });
  }

  spawnMine() {
    let mine = this.mines.getFirstExists(false);
    if (!mine) {
      mine = new Mine(this.game, 0, 0);
      this.mines.add(mine);
    }
    mine.reset(this.getRandomInt(0, this.world.width), 0);
    mine.body.velocity.y = MINE_BODY_VELOCITY_Y;
  }

  fireBullet () {
    if (!this.player.alive || this.nextShotAt > this.time.now) return;
    if (this.bullets.countDead() === 0) return;

    this.bullet = this.bullets.getFirstDead();
    this.shootSound.play();
    this.nextShotAt = this.time.now + this.shotDelay;
    if (this.player.movesRight) {
      this.bullet.reset(this.player.x + 60, this.player.y);
      this.bullet.body.velocity.x = BULLET_VELOCITY;
    } else if (!this.player.movesRight) {
      this.bullet.reset(this.player.x - 60, this.player.y);
      this.bullet.body.velocity.x = - BULLET_VELOCITY;
    }
  }

  fireSpray () {
    if (!this.player.alive || this.nextShotAt > this.time.now) return;
    if (this.bullets.countDead() === 0) return;

    for (let i = - 2;i < 3;i += 1) {
      this.bullet = this.bullets.getFirstDead();
      this.shootSound.play();
      this.nextShotAt = this.time.now + this.shotDelay;
      if (this.player.movesRight) {
        this.bullet.reset(this.player.x + 60 - Math.abs(i * 5), this.player.y + 15 * i);
        this.bullet.body.velocity.x = BULLET_VELOCITY;
        this.bullet.body.velocity.y = BULLET_VELOCITY * i / 8;
      } else if (!this.player.movesRight) {
        this.bullet.reset(this.player.x - 60 + Math.abs(i * 5), this.player.y  + 15 * i);
        this.bullet.body.velocity.x = - BULLET_VELOCITY;
        this.bullet.body.velocity.y = BULLET_VELOCITY * i / 8;
      }
    }
  }

  fireRocket () {
    if (!this.player.alive || this.nextShotAt > this.time.now) return;
    if (this.rockets.countDead() === 0) return;

    this.rocket = this.rockets.getFirstDead();
    this.rocketSound.play();
    this.nextShotAt = this.time.now + this.shotDelay;
    if (this.player.movesRight) {
      this.rocket.angle = 0;
      this.rocket.reset(this.player.x + 100, this.player.y);
      this.rocket.body.velocity.x = BULLET_VELOCITY;
    } else if (!this.player.movesRight) {
      this.rocket.angle = 180;
      this.rocket.reset(this.player.x - 100, this.player.y);
      this.rocket.body.velocity.x = - BULLET_VELOCITY;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  update() {
    this.playerControls();
    this.checkCollisions();
    this.checkGhostUntil();
    this.addAdvancedEnemy();
  }

  addAdvancedEnemy() {
    if (this.score >= 400 && !this.enemyAdvGenerator) {
      this.enemyAdvGenerator = this.time.events.loop(ENEMY_SPAWN_TIME * 3, this.generateAdvEnemies, this);
    }

    if (this.score >= 800 && !this.enemyBossGenerator) {
      this.enemyBossGenerator = this.time.events.loop(ENEMY_SPAWN_TIME * 5, this.generateBossEnemies, this);
    }
  }

  playerControls() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = - PLAYER_VELOCITY_Y;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = PLAYER_VELOCITY_Y;
    }

    if (this.cursors.right.isDown) {
      this.player.body.velocity.x = PLAYER_VELOCITY_X;
      this.player.scale.setTo(1, 1);
      this.player.movesRight = true;
    } else if (this.cursors.left.isDown) {
      this.player.body.velocity.x = - PLAYER_VELOCITY_X;
      this.player.scale.setTo(- 1, 1);
      this.player.movesRight = false;
    }

    if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 70) {
      this.physics.arcade.moveToPointer(this.player, PLAYER_VELOCITY_X);

      if (this.input.activePointer.worldX > this.player.x) {
        this.player.scale.setTo(1, 1);
        this.player.movesRight = true;
      } else {
        this.player.scale.setTo(- 1, 1);
        this.player.movesRight = false;
      }
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
      this.input.activePointer.isDown) {
      if (sprayPowerUp) {
        this.fireSpray();
      } else if (rocketPowerUp) {
        this.fireRocket();
      } else {
        this.fireBullet();
      }
    }
  }

  checkCollisions() {
    this.physics.arcade.collide(this.player, this.mines, this.mineHitHandler, null, this);
    this.physics.arcade.collide(this.bullets, this.mines, this.mineShotHandler, null, this);
    this.physics.arcade.collide(this.rockets, this.mines, this.mineShotHandler, null, this);

    this.physics.arcade.collide(this.player, this.enemiesRegular, this.enemyHitHandler, null, this);
    this.physics.arcade.collide(this.bullets, this.enemiesRegular, this.enemyShotBulletHandler, null, this);
    this.physics.arcade.collide(this.rockets, this.enemiesRegular, this.enemyShotRocketHandler, null, this);

    this.physics.arcade.collide(this.player, this.enemiesAdvanced, this.enemyHitHandler, null, this);
    this.physics.arcade.collide(this.bullets, this.enemiesAdvanced, this.enemyShotBulletHandler, null, this);
    this.physics.arcade.collide(this.rockets, this.enemiesAdvanced, this.enemyShotRocketHandler, null, this);

    this.physics.arcade.collide(this.player, this.enemiesBoss, this.enemyHitHandler, null, this);
    this.physics.arcade.collide(this.bullets, this.enemiesBoss, this.enemyShotBulletHandler, null, this);
    this.physics.arcade.collide(this.rockets, this.enemiesBoss, this.enemyShotRocketHandler, null, this);

    this.physics.arcade.collide(this.player, this.lifeBoosts, this.lifeBoostHitHandler, null, this);
    this.physics.arcade.collide(this.player, this.powerUps, this.powerUpHitHandler, null, this);
  }

  addToScore(score) {
    this.score += score;
    this.scoreText.text = this.score;
  }

  generateLifeBoost() {
    const lifeBoostX = this.generateRandom(0, this.game.width);
    let lifeBoost = this.lifeBoosts.getFirstExists(false);
    if (!lifeBoost) {
      lifeBoost = new LifeBoost(this.game, 0, 0);
      this.lifeBoosts.add(lifeBoost);
    }
    lifeBoost.reset(lifeBoostX, 0);
    lifeBoost.body.gravity.y = LIFE_BOOST_GRAVITY_Y;
  }

  generatePowerUp() {
    const powerUpX = this.generateRandom(0, this.game.width);
    let powerUp = this.powerUps.getFirstExists(false);
    if (!powerUp) {
      powerUp = new PowerUp(this.game, 0, 0);
      this.powerUps.add(powerUp);
    }
    powerUp.reset(powerUpX, 0);
    powerUp.body.gravity.y = POWER_UP_GRAVITY_Y;
  }

  generateRegEnemies() {
    const enemyY = this.rnd.integerInRange(100, 760);
    const direction = this.generateRandom(- 1, 1);
    let enemy = this.enemiesRegular.getFirstExists(false);

    if (!enemy) {
      enemy = new Enemy(this.game, 0, 0, ENEMY_TYPES[0]);
      this.enemiesRegular.add(enemy);
    }
    enemy.resetDirection(this.game.width / 2 + (this.game.width / 2 + enemy.width / 2) * direction, enemyY, direction);

    if (ENEMY_SPAWN_TIME - delay >= 500) {
      delay = delay + 20;
    }
    this.game.time.events.remove(this.enemyRegGenerator);
    this.enemyRegGenerator = this.time.events.loop(ENEMY_SPAWN_TIME - delay, this.generateRegEnemies, this);
  }

  generateAdvEnemies() {
    const enemyY = this.rnd.integerInRange(100, 760);
    const direction = this.generateRandom(- 1, 1);
    let enemy = this.enemiesAdvanced.getFirstExists(false);

    if (!enemy) {
      enemy = new Enemy(this.game, 0, 0, ENEMY_TYPES[1]);
      this.enemiesAdvanced.add(enemy);
    }
    enemy.resetDirection(this.game.width / 2 + (this.game.width / 2 + enemy.width / 2) * direction, enemyY, direction);
  }

  generateBossEnemies() {
    const enemyY = this.rnd.integerInRange(100, 760);
    const direction = this.generateRandom(- 1, 1);
    let enemy = this.enemiesBoss.getFirstExists(false);

    if (!enemy) {
      enemy = new Enemy(this.game, 0, 0, ENEMY_TYPES[2]);
      this.enemiesBoss.add(enemy);
    }
    enemy.resetDirection(this.game.width / 2 + (this.game.width / 2 + enemy.width / 2) * direction, enemyY, direction);
  }

  generateRandom(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num === 0) ? this.generateRandom(min, max) : num;
  }

  mineHitHandler(player, mine) {
    mine.kill();
    this.playerHitSound.play();
    this.gameOver();
  }

  enemyHitHandler(player, enemy) {
    this.playerHitSound.play();
    this.player.animations.play(`ghost`);
    this.ghostUntil = this.time.now + PLAYER_GHOST_TIME;
    enemy.kill();
    const life = this.lifeIcons.getFirstAlive();

    if (life !== null) {
      life.frame = 1;
      life.alpha = 0.5;
      life.alive = false;
      this.extraLives -= 1;
      this.ghostUntil = this.time.now + PLAYER_GHOST_TIME;
      player.play(`ghost`);
    } else {
      player.kill();
      this.explode(player);
      this.gameOver();
    }
  }

  lifeBoostHitHandler(player, lifeBoost) {
    lifeBoost.kill();
    this.healthSound.play();
    this.lifeIcons.forEach(life => {
      if (!life.alive) {
        life.alpha = 1;
        life.alive = true;
        return true;
      }
    });
  }

  powerUpHitHandler(player, powerUp) {
    this.powerUpSound.play();
    const randomPowerUpPicker = Math.floor((Math.random() * 3));
    this.randomPowerUpHandler(randomPowerUpPicker);
    powerUp.kill();
  }

  randomPowerUpHandler(i) {
    if (i === 0) {
      this.shotDelay = 100;
    }

    if (i === 1) {
      sprayPowerUp = 1;
    }

    if (i === 2) {
      rocketPowerUp = 1;
    }

    this.powerUpTimer = this.time.events.loop(POWER_UP_TIME, this.quitPowerUp, this);
  }

  mineShotHandler(bullet, mine) {
    this.enemyExplosionSound.play();
    bullet.kill();
    this.explode(mine);
    mine.kill();
    this.addToScore(50);
  }

  enemyShotBulletHandler(bullet, enemy) {
    bullet.kill();
    this.ghostUntil = this.time.now + PLAYER_GHOST_TIME;
    enemy.play(`ghost`);
    enemy.hitPoints = enemy.hitPoints - 1;

    if (enemy.hitPoints <= 0) {
      this.explode(enemy);
      enemy.kill();
      this.addToScore(enemy.scorePoints);
    }
  }

  enemyShotRocketHandler(rocket, enemy) {
    rocket.kill();
    this.ghostUntil = this.time.now + PLAYER_GHOST_TIME;
    enemy.play(`ghost`);
    enemy.hitPoints = enemy.hitPoints - 5;

    if (enemy.hitPoints <= 0) {
      this.explode(enemy);
      enemy.kill();
      this.addToScore(enemy.scorePoints);
    }
  }

  explode(sprite) {
    if (this.explosions.countDead() === 0) return;
    const explosion = this.explosions.getFirstExists(false);
    explosion.play(`boom`, 14, false, true);
    explosion.reset(sprite.x, sprite.y);
    this.enemyExplosionSound.play();
  }

  checkGhostUntil() {
    if (this.ghostUntil && this.ghostUntil < this.time.now) {
      this.enemiesRegular.forEach(enemy => {
        enemy.play(`float`);
      });

      this.enemiesAdvanced.forEach(enemy => {
        enemy.play(`float`);
      });

      this.enemiesBoss.forEach(enemy => {
        enemy.play(`float`);
      });
      this.ghostUntil = null;
      this.player.play(`sail`);
    }
  }

  quitPowerUp() {
    this.shotDelay = 300;
    sprayPowerUp = 0;
    rocketPowerUp = 0;
    this.game.time.events.remove(this.powerUpTimer);
  }

  gameOver() {
    this.game.world.removeAll();
    this.game.time.events.remove(this.enemyRegGenerator);
    this.game.time.events.remove(this.enemyAdvGenerator);
    this.game.time.events.remove(this.enemyBossGenerator);
    this.game.time.events.remove(this.mineSpawnTimer);
    this.game.time.events.remove(this.powerUpTimer);
    this.game.time.events.remove(this.lifeBoostGenerator);
    delay = 10;
    this.backgroundimage = this.add.sprite(0, 0, `background`);
    this.gameOverLayout = this.add.image(this.game.width / 2, this.game.height / 2, `layout_gameover`);
    this.gameOverLayout.anchor.setTo(0.5, 0.5);
    this.player = new Player (this.game, 615, this.game.height / 2 - 120);
    this.add.existing(this.player);
    this.player.body.moves = false;
    this.scoreboard = new GameOver(this.game);
    this.game.add.existing(this.scoreboard);
    this.scoreboard.show(this.score);
    form.style.display = `block`;
    // Score in veld steken.
    this.scoreVeld = document.querySelector(`.scoreVeld`);
    this.scoreVeld.value = this.score;
    const endDate = new Date();
    let durationHours = endDate.getHours() - startDate.getHours();
    let durationMinutes = endDate.getMinutes() - startDate.getMinutes();
    let durationSeconds = endDate.getSeconds() - startDate.getSeconds();
    if (durationSeconds < 0) {
      durationSeconds = 60 + durationSeconds;
      durationMinutes --;
    }
    if (durationMinutes < 0) {
      durationMinutes = 60 + durationMinutes;
      durationHours --;
    }
    if (durationHours < 10) {
      durationHours = `0${  durationHours}`;
    }
    if (durationMinutes < 10) {
      durationMinutes = `0${  durationMinutes}`;
    }
    if (durationSeconds < 10) {
      durationSeconds = `0${  durationSeconds}`;
    }
    const duration = `${durationHours}:${durationMinutes}:${durationSeconds}`;
    console.log(duration);
    this.scoreData = document.querySelector(`.score`);
    this.scoreData.value = this.score;
    this.durationData = document.querySelector(`.duration`);
    this.durationData.value = duration;
    this.createdData = document.querySelector(`.created`);
    this.createdData.value = created;
    console.log(date);
    this.dateData = document.querySelector(`.date`);
    this.dateData.value = date;
    // Submit opvangen.
    this.naamVeld = document.querySelector(`.naamVeld`);
    form.addEventListener(`submit`, this.sendScore);
    //formData.submit();

  }

  // render() {
  //   this.mines.forEach(mine => {
  //     this.game.debug.body(mine);
  //   });
  //   this.enemiesRegular.forEach(enemyreg => {
  //     this.game.debug.body(enemyreg);
  //   });
  //   this.enemiesAdvanced.forEach(enemyadv => {
  //     this.game.debug.body(enemyadv);
  //   });
  //   this.enemiesBoss.forEach(enemyboss => {
  //     this.game.debug.body(enemyboss);
  //   });
  //   this.game.debug.body(this.player);
  // }

  sendScore(e) {
    this.savedData = document.querySelector(`.saved`);
    this.savedData.value = `true`;
    e.preventDefault();
    fetch(`${form.getAttribute(`action`)}?t=${Date.now()}`, {
      headers: new Headers({
        Accept: `application/json`
      }),
      method: `post`,
      body: new FormData(form)
    });

    fetch(`${formData.getAttribute(`action`)}?t=${Date.now()}`, {
      headers: new Headers({
        Accept: `application/json`
      }),
      method: `post`,
      body: new FormData(formData)
    })

    .then(r => r.json())
    .then(result => {
      console.log(result.result);
      if (result.result === `ok`) {
        //clear form input
        form.querySelector(`[name="name"]`).value = ``;
        form.querySelector(`[name="highscore"]`).value = ``;
        form.style.display = `none`;
        this.bevestiging = document.querySelector(`.verzonden`);
        this.bevestiging.style.display = `block`;
      } else {
        //TODO
        alert(`Please... fill in a name :)`);
      }
    });
  }
}
