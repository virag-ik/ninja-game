import AsyncStorage from '@react-native-async-storage/async-storage';

export const V_WIDTH = 1280;
export const V_HEIGHT = 720;

export class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export type ParticleType = 'cherry' | 'dust' | 'blood' | 'spark' | 'bossFire';

export class Particle {
  x: number;
  y: number;
  type: ParticleType;
  active: boolean;
  vx: number = 0;
  vy: number = 0;
  size: number = 0;
  life: number = 0;
  maxLife: number = 0;
  color: string = '';
  rotation: number = 0;
  rotSpeed: number = 0;

  constructor(x: number, y: number, type: ParticleType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;

    switch (type) {
      case 'cherry':
        this.vx = -1 - Math.random() * 2;
        this.vy = 0.5 + Math.random() * 1.5;
        this.size = 3 + Math.random() * 4;
        this.life = 100 + Math.random() * 100;
        this.color = 'rgba(' + (230 + Math.floor(Math.random()*25)) + ',' + (150 + Math.floor(Math.random()*40)) + ',' + (170 + Math.floor(Math.random()*30)) + ',' + (0.4 + Math.random()*0.4) + ')';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        break;
      case 'dust':
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -Math.random() * 0.8;
        this.size = 2 + Math.random() * 3;
        this.life = 15 + Math.random() * 15;
        this.color = 'rgba(120, 120, 120, 0.4)';
        break;
      case 'blood':
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -3 - Math.random() * 4;
        this.size = 2 + Math.random() * 3;
        this.life = 30 + Math.random() * 20;
        this.color = Math.random() > 0.3 ? 'rgba(180, 0, 0, 0.8)' : 'rgba(30, 30, 30, 0.9)';
        break;
      case 'spark':
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = 2 + Math.random() * 2;
        this.life = 20 + Math.random() * 15;
        this.color = 'rgba(255,' + (200 + Math.floor(Math.random()*55)) + ',0,0.9)';
        break;
      case 'bossFire':
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -1 - Math.random() * 3;
        this.size = 8 + Math.random() * 12;
        this.life = 30 + Math.random() * 20;
        this.color = 'rgba(255,' + (100 + Math.floor(Math.random()*80)) + ',0,0.7)';
        break;
    }
    this.maxLife = this.life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.active = false;

    if (this.type === 'cherry') {
      this.vx += Math.sin(this.life * 0.05) * 0.05;
      this.rotation += this.rotSpeed;
    } else if (this.type === 'blood') {
      this.vy += 0.25;
    } else if (this.type === 'dust') {
      this.size = Math.max(0.1, this.size - 0.1);
    } else if (this.type === 'spark') {
      this.vx *= 0.95;
      this.vy *= 0.95;
    } else if (this.type === 'bossFire') {
      this.size *= 0.96;
    }
  }
}

export type ProjectileType = 'shuriken' | 'arrow' | 'fireball';

export class Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isEnemy: boolean;
  type: ProjectileType;
  radius: number;
  active: boolean;
  angle: number;

  constructor(x: number, y: number, vx: number, vy: number, isEnemy = false, type: ProjectileType = 'shuriken') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isEnemy = isEnemy;
    this.type = type;
    this.radius = type === 'shuriken' ? 10 : (type === 'arrow' ? 6 : 14);
    this.active = true;
    this.angle = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += 0.25;

    if (this.type === 'arrow') {
      this.vy += 0.06;
    }
  }
}

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class Checkpoint {
  x: number;
  y: number;
  width = 45;
  height = 70;
  active = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  checkCollision(player: Player, particles: Particle[], playSound: (s: string) => void) {
    if (!this.active && player.x + 20 > this.x && player.x + 20 < this.x + this.width &&
        player.y + 40 > this.y && player.y + 40 < this.y + this.height) {
      
      this.active = true;
      playSound('checkpoint');
      
      player.checkpointX = this.x + 10;
      player.checkpointY = this.y - 10;
      
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(this.x + 22, this.y + 35, 'spark'));
      }
    }
  }
}

export class Chest {
  x: number;
  y: number;
  w = 50;
  h = 40;
  active = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  destroy(particles: Particle[], game: GameState) {
    if (!this.active) return;
    this.active = false;
    
    const lootCount = 4 + Math.floor(Math.random()*4);
    for (let i = 0; i < lootCount; i++) {
      const coinX = this.x + 25 + (Math.random() - 0.5)*15;
      const coinY = this.y + 10;
      game.coins.push(new Coin(coinX, coinY, true));
    }

    for (let i = 0; i < 10; i++) {
      particles.push(new Particle(this.x + 25, this.y + 20, 'spark'));
    }
  }
}

export class Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius = 9;
  active = true;
  spin: number;

  constructor(x: number, y: number, spawnVelocity = false) {
    this.x = x;
    this.y = y;
    this.vx = spawnVelocity ? (Math.random() - 0.5)*5 : 0;
    this.vy = spawnVelocity ? -5 - Math.random()*3 : 0;
    this.spin = Math.random() * Math.PI;
  }

  update(platforms: Platform[]) {
    if (Math.abs(this.vx) > 0.05 || Math.abs(this.vy) > 0.05) {
      this.vy += 0.35;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;

      platforms.forEach(plat => {
        if (this.x + this.radius > plat.x && this.x - this.radius < plat.x + plat.w) {
          if (this.y + this.radius >= plat.y && this.y + this.radius - this.vy <= plat.y + 8) {
            this.y = plat.y - this.radius;
            this.vy = -this.vy * 0.45;
            this.vx *= 0.5;
          }
        }
      });
    }
    this.spin += 0.12;
  }
}

export class Scroll {
  x: number;
  y: number;
  width = 32;
  height = 42;
  active = true;
  floatOffset: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.floatOffset = Math.random() * 100;
  }

  checkCollision(player: Player, game: GameState, particles: Particle[]) {
    if (this.active && player.x + 20 > this.x - 10 && player.x + 20 < this.x + this.width + 10 &&
        player.y + 40 > this.y - 10 && player.y + 40 < this.y + this.height + 15) {
      
      this.active = false;
      game.scrollsFound++;
      game.playSound('scroll');

      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(this.x + 16, this.y + 20, 'spark'));
      }
    }
  }
}

export class ToriiGate {
  x: number;
  y: number;
  w = 120;
  h = 130;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export type TrapType = 'spikes' | 'saw';

export class Trap {
  x: number;
  y: number;
  type: TrapType;
  w: number;
  h: number;
  angle = 0;
  startX: number;
  range = 220;
  speed = 0.02;

  constructor(x: number, y: number, type: TrapType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.w = type === 'spikes' ? 80 : 64;
    this.h = type === 'spikes' ? 30 : 64;
    this.startX = x;
  }

  update() {
    if (this.type === 'saw') {
      this.angle += this.speed;
      this.x = this.startX + Math.sin(this.angle) * this.range;
    }
  }

  checkCollision(player: Player) {
    if (this.type === 'spikes') {
      if (player.x + 20 > this.x && player.x + 20 < this.x + this.w &&
          player.y + 60 >= this.y && player.y + 10 < this.y + this.h) {
        player.takeDamage(1, this.x + this.w/2);
      }
    } else if (this.type === 'saw') {
      const sawCenterX = this.x + 32;
      const sawCenterY = this.y + 32;
      const pCenterX = player.x + 20;
      const pCenterY = player.y + 30;
      const dx = pCenterX - sawCenterX;
      const dy = pCenterY - sawCenterY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 46) {
        player.takeDamage(1, sawCenterX);
      }
    }
  }
}

export type EnemyType = 'guard' | 'archer' | 'spear' | 'oni';

export class Enemy {
  x: number;
  y: number;
  type: EnemyType;
  active: boolean;
  vx: number;
  vy: number;
  dir: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  patrolLeft: number;
  patrolRight: number;
  detectRange: number;
  alert: boolean;
  attackCooldown: number;
  spearChargeTimer: number;
  chargeReady: boolean;
  animCycle: number;
  hurtTimer: number;
  goldDropped = false;
  groundSlamQueued = false;

  constructor(x: number, y: number, type: EnemyType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.vx = type === 'guard' ? 1.5 : (type === 'spear' ? 2 : 0);
    this.vy = 0;
    this.dir = 1;
    this.width = type === 'oni' ? 70 : 40;
    this.height = type === 'oni' ? 110 : 60;
    this.health = type === 'guard' ? 2 : (type === 'archer' ? 1 : (type === 'spear' ? 3 : 18));
    this.maxHealth = this.health;
    
    this.patrolLeft = x - 150;
    this.patrolRight = x + 150;
    this.detectRange = type === 'archer' ? 450 : (type === 'oni' ? 600 : 250);
    this.alert = false;
    this.attackCooldown = 0;
    this.spearChargeTimer = 0;
    this.chargeReady = false;
    this.animCycle = Math.random() * 10;
    this.hurtTimer = 0;
  }

  takeDamage(amount: number, fromX: number, particles: Particle[], playSound: (s: string) => void) {
    if (!this.active) return;
    this.health -= amount;
    playSound('hit');
    this.hurtTimer = 10;
    this.alert = true;

    this.vx = (this.x > fromX ? 4.5 : -4.5);
    this.vy = -3.5;

    for (let i = 0; i < 8; i++) {
      particles.push(new Particle(this.x + this.width/2, this.y + this.height/2, 'blood'));
    }

    if (this.health <= 0) {
      this.active = false;
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(this.x + this.width/2, this.y + this.height/2, 'spark'));
      }
    }
  }

  update(player: Player, platforms: Platform[], projectiles: Projectile[], particles: Particle[], game: GameState) {
    if (!this.active) return;

    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;

    this.vy += 0.4;
    this.y += this.vy;

    platforms.forEach(plat => {
      if (this.x + this.width > plat.x && this.x < plat.x + plat.w) {
        if (this.y + this.height >= plat.y && this.y + this.height - this.vy <= plat.y + 12) {
          this.y = plat.y - this.height;
          this.vy = 0;
        }
      }
    });

    if (player.dead) {
      this.vx *= 0.9;
      this.x += this.vx;
      return;
    }

    const distToPlayer = Math.abs((player.x + 20) - (this.x + this.width/2));
    const heightDiff = Math.abs(player.y - this.y);
    
    const isDisguised = player.isDisguised;
    const actualDetectRange = isDisguised ? 25 : this.detectRange;

    if (distToPlayer < actualDetectRange && heightDiff < 100) {
      this.alert = true;
      this.dir = (player.x > this.x) ? 1 : -1;
    } else {
      this.alert = false;
    }

    if (this.type === 'guard') {
      if (this.alert) {
        this.vx = this.dir * 2.8;
        if (distToPlayer < 55 && this.attackCooldown <= 0) {
          this.attackCooldown = 50;
          player.takeDamage(1, this.x);
        }
      } else {
        if (this.x <= this.patrolLeft) {
          this.dir = 1;
        } else if (this.x >= this.patrolRight) {
          this.dir = -1;
        }
        this.vx = this.dir * 1.5;
      }
      this.x += this.vx;
      this.animCycle += 0.15;
    } 
    else if (this.type === 'archer') {
      if (this.alert) {
        this.vx = 0;
        if (this.attackCooldown <= 0) {
          this.attackCooldown = 110;
          const arrowSpeed = this.dir * 8.5;
          projectiles.push(new Projectile(this.x + this.width/2 + this.dir*15, this.y + 20, arrowSpeed, -0.6, true, 'arrow'));
          game.playSound('shuriken');
        }
      } else {
        this.vx = 0;
      }
    } 
    else if (this.type === 'spear') {
      if (this.alert) {
        if (this.spearChargeTimer > 0) {
          this.spearChargeTimer--;
          if (this.spearChargeTimer === 0) {
            this.vx = this.dir * 12.0;
            this.attackCooldown = 110;
          } else {
            this.vx = 0;
          }
        } else {
          if (distToPlayer < 180 && this.attackCooldown <= 0 && !this.chargeReady) {
            this.spearChargeTimer = 22;
            this.chargeReady = true;
          } else {
            this.vx = this.dir * 3.2;
            if (distToPlayer < 60 && this.chargeReady) {
              player.takeDamage(1, this.x);
              this.chargeReady = false;
              this.vx = -this.dir * 2;
            }
          }
        }
      } else {
        this.chargeReady = false;
        if (this.x <= this.patrolLeft) this.dir = 1;
        else if (this.x >= this.patrolRight) this.dir = -1;
        this.vx = this.dir * 1.8;
      }
      this.x += this.vx;
      this.animCycle += 0.2;
    } 
    else if (this.type === 'oni') {
      if (this.alert) {
        this.vx = this.dir * 1.0;
        this.x += this.vx;
        
        if (this.attackCooldown <= 0) {
          const attackRoll = Math.random();
          if (attackRoll < 0.6) {
            this.attackCooldown = 120;
            projectiles.push(new Projectile(this.x + this.width/2, this.y + 40, this.dir * 7, 0, true, 'fireball'));
            projectiles.push(new Projectile(this.x + this.width/2, this.y + 20, this.dir * 6.5, -2, true, 'fireball'));
            game.playSound('shuriken');
          } else {
            this.attackCooldown = 160;
            this.vy = -11.0;
            this.groundSlamQueued = true;
          }
        }
      } else {
        this.vx = 0;
      }

      if (this.groundSlamQueued && this.vy === 0) {
        this.groundSlamQueued = false;
        game.playSound('hit');
        for (let i = 0; i < 18; i++) {
          particles.push(new Particle(this.x + 35, this.y + 90, 'bossFire'));
        }
        if (player.grounded && distToPlayer < 350) {
          player.takeDamage(1, this.x);
        }
      }
    }
  }
}

export class Player {
  maxHealth = 3;
  health = 3;
  dashCooldownMax = 120;
  shurikenLevel = 1;
  meleeLevel = 1;

  x = 100;
  y = 500;
  vx = 0;
  vy = 0;
  width = 40;
  height = 60;
  grounded = false;
  dir = 1;
  doubleJumpsLeft = 2;
  dashTimer = 0;
  dashCooldown = 0;
  isDashing = false;
  slashTimer = 0;
  isSlashing = false;
  shurikenCooldown = 0;
  isDisguised = false;
  disguiseCooldown = 0;
  hurtTimer = 0;
  invincibleTimer = 0;
  dead = false;
  animCycle = 0;
  scarfPoints: Vector2[] = [];
  checkpointX?: number;
  checkpointY?: number;
  lastJumpInput = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.health = this.maxHealth;
    this.x = 100;
    this.y = 500;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.dir = 1;
    this.doubleJumpsLeft = 2;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.isDashing = false;
    this.slashTimer = 0;
    this.isSlashing = false;
    this.shurikenCooldown = 0;
    this.isDisguised = false;
    this.disguiseCooldown = 0;
    this.hurtTimer = 0;
    this.invincibleTimer = 0;
    this.dead = false;
    this.animCycle = 0;

    this.scarfPoints = [];
    for (let i = 0; i < 8; i++) {
      this.scarfPoints.push(new Vector2(this.x, this.y));
    }
  }

  upgrade(type: 'health' | 'dash' | 'shuriken' | 'melee', cost: number, game: GameState) {
    if (game.gold >= cost) {
      game.gold -= cost;
      if (type === 'health') {
        this.maxHealth = Math.min(5, this.maxHealth + 1);
        this.health = this.maxHealth;
      } else if (type === 'dash') {
        this.dashCooldownMax = Math.max(60, this.dashCooldownMax - 20);
      } else if (type === 'shuriken') {
        this.shurikenLevel = Math.min(3, this.shurikenLevel + 1);
      } else if (type === 'melee') {
        this.meleeLevel = Math.min(3, this.meleeLevel + 1);
      }
      game.saveData();
      game.playSound('scroll');
      return true;
    }
    return false;
  }

  takeDamage(amount: number, fromX: number) {
    if (this.invincibleTimer > 0 || this.dead || this.isDashing) return;

    this.health -= amount;
    this.hurtTimer = 15;
    this.invincibleTimer = 45;
    this.isDisguised = false;

    this.vy = -6;
    this.vx = (this.x > fromX ? 6 : -6);
    this.grounded = false;

    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
    }
  }

  update(
    keys: Record<string, boolean>,
    touches: Record<string, boolean>,
    platforms: Platform[],
    particles: Particle[],
    projectiles: Projectile[],
    game: GameState
  ) {
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.shurikenCooldown > 0) this.shurikenCooldown--;
    if (this.disguiseCooldown > 0) this.disguiseCooldown--;
    if (this.invincibleTimer > 0) this.invincibleTimer--;
    if (this.hurtTimer > 0) this.hurtTimer--;

    if (this.dead) {
      this.vy += 0.4;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.9;
      return;
    }

    if (this.isDashing) {
      this.dashTimer--;
      this.vy = 0;
      
      if (this.dashTimer % 2 === 0) {
        particles.push(new Particle(this.x, this.y + 20 + Math.random()*20, 'dust'));
      }

      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.vx = this.dir * 4;
      }

      this.x += this.vx;
      this.checkMapCollisions(platforms);
      this.updateScarf();
      return;
    }

    if (this.isSlashing) {
      this.slashTimer--;
      if (this.slashTimer <= 0) {
        this.isSlashing = false;
      }
    }

    let moveX = 0;
    let inputLeft = keys['ArrowLeft'] || keys['KeyA'] || touches['left'];
    let inputRight = keys['ArrowRight'] || keys['KeyD'] || touches['right'];
    let inputJump = keys['ArrowUp'] || keys['KeyW'] || keys['Space'] || touches['jump'];
    let inputDash = keys['ShiftLeft'] || keys['KeyJ'] || touches['dash'];
    let inputSlash = keys['KeyK'] || touches['slash'];
    let inputShuriken = keys['KeyL'] || touches['shuriken'];
    let inputDisguise = keys['KeyI'] || touches['disguise'];

    if (this.isDisguised && (inputLeft || inputRight || inputJump || inputSlash || inputShuriken)) {
      this.isDisguised = false;
      this.disguiseCooldown = 40;
      game.playSound('disguise');
    }

    if (!this.isDisguised) {
      if (inputLeft) {
        moveX = -1;
        this.dir = -1;
      } else if (inputRight) {
        moveX = 1;
        this.dir = 1;
      }

      const speedAcc = 0.6;
      const maxSpd = 7;
      const frict = 0.16;

      if (moveX !== 0) {
        this.vx += moveX * speedAcc;
        this.vx = Math.max(-maxSpd, Math.min(maxSpd, this.vx));
        this.animCycle += 0.25;
        
        if (this.grounded && Math.random() < 0.25) {
          particles.push(new Particle(this.x + (this.dir === 1 ? 5 : 35), this.y + 60, 'dust'));
        }
      } else {
        this.vx *= (1 - frict);
        if (Math.abs(this.vx) < 0.1) this.vx = 0;
      }

      if (inputJump) {
        if (this.grounded) {
          this.vy = -12.5;
          this.grounded = false;
          this.doubleJumpsLeft = 1;
          game.playSound('jump');
          particles.push(new Particle(this.x + 20, this.y + 60, 'dust'));
        } else if (this.doubleJumpsLeft > 0 && inputJump !== this.lastJumpInput) {
          this.vy = -10.5;
          this.doubleJumpsLeft = 0;
          game.playSound('doubleJump');
          for (let i = 0; i < 8; i++) {
            particles.push(new Particle(this.x + 20, this.y + 30, 'dust'));
          }
        }
      }
      this.lastJumpInput = inputJump;

      if (inputDash && this.dashCooldown <= 0) {
        this.isDashing = true;
        this.dashTimer = 11;
        this.dashCooldown = this.dashCooldownMax;
        this.vx = this.dir * 24;
        this.vy = 0;
        game.playSound('dash');
        for (let i = 0; i < 10; i++) {
          particles.push(new Particle(this.x + 20, this.y + 30, 'spark'));
        }
      }

      if (inputSlash && !this.isSlashing && this.slashTimer <= 0) {
        this.isSlashing = true;
        this.slashTimer = 14;
        game.playSound('slash');
        
        const slashRange = 75 + (this.meleeLevel * 10);
        const slashDmg = 1 + Math.floor(this.meleeLevel * 0.5);
        const checkX = this.x + 20 + this.dir * slashRange/2;
        
        game.enemies.forEach(e => {
          if (e.active && Math.abs(e.y - this.y) < 60 && Math.abs(e.x - checkX) < (slashRange/2 + 25)) {
            e.takeDamage(slashDmg, this.x, particles, game.playSound);
          }
        });

        game.chests.forEach(c => {
          if (c.active && Math.abs(c.y - this.y) < 60 && Math.abs((c.x + 25) - (this.x + 20)) < slashRange) {
            c.destroy(particles, game);
          }
        });
      }

      if (inputShuriken && this.shurikenCooldown <= 0) {
        this.shurikenCooldown = 28;
        game.playSound('shuriken');

        const pSpeed = 16 * this.dir;
        const yOffset = 25;
        
        if (this.shurikenLevel === 1) {
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset, pSpeed, 0, false, 'shuriken'));
        } else if (this.shurikenLevel === 2) {
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset - 5, pSpeed, -1, false, 'shuriken'));
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset + 5, pSpeed, 1, false, 'shuriken'));
        } else if (this.shurikenLevel === 3) {
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset - 8, pSpeed, -1.8, false, 'shuriken'));
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset, pSpeed, 0, false, 'shuriken'));
          projectiles.push(new Projectile(this.x + 20 + this.dir*15, this.y + yOffset + 8, pSpeed, 1.8, false, 'shuriken'));
        }
      }
    }

    if (inputDisguise && this.disguiseCooldown <= 0 && this.grounded && !this.isSlashing) {
      this.isDisguised = !this.isDisguised;
      this.disguiseCooldown = 50;
      this.vx = 0;
      game.playSound('disguise');
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(this.x + 20, this.y + 30, 'dust'));
      }
    }

    this.vy += 0.45;
    this.x += this.vx;
    this.y += this.vy;

    this.checkMapCollisions(platforms);
    this.updateScarf();
  }

  checkMapCollisions(platforms: Platform[]) {
    this.grounded = false;
    platforms.forEach(plat => {
      if (this.x + this.width > plat.x && this.x < plat.x + plat.w) {
        if (this.y + this.height >= plat.y && this.y + this.height - this.vy <= plat.y + 12) {
          this.y = plat.y - this.height;
          this.vy = 0;
          this.grounded = true;
          this.doubleJumpsLeft = 2;
        } 
        else if (this.y < plat.y + plat.h && this.y - this.vy >= plat.y + plat.h - 10) {
          this.y = plat.y + plat.h;
          this.vy = 0;
        }
      }
    });
  }

  updateScarf() {
    const anchorX = this.x + (this.dir === 1 ? 5 : 35);
    const anchorY = this.y + 14;

    this.scarfPoints[0].x = anchorX;
    this.scarfPoints[0].y = anchorY;

    for (let i = 1; i < this.scarfPoints.length; i++) {
      const p = this.scarfPoints[i];
      const prev = this.scarfPoints[i - 1];
      const dx = prev.x - p.x;
      const dy = prev.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const targetDist = 6;
      
      if (dist > targetDist) {
        const ratio = targetDist / dist;
        p.x = prev.x - dx * ratio;
        p.y = prev.y - dy * ratio + 0.45;
      }
    }
  }
}

export type SceneType = 'menu' | 'levels' | 'upgrades' | 'play' | 'gameover' | 'clear';

export class GameState {
  scene: SceneType = 'menu';
  gold = 0;
  levelUnlocked = 1;
  currentLevelIndex = 1;

  player: Player;
  platforms: Platform[] = [];
  enemies: Enemy[] = [];
  checkpoints: Checkpoint[] = [];
  chests: Chest[] = [];
  coins: Coin[] = [];
  scrolls: Scroll[] = [];
  traps: Trap[] = [];
  projectiles: Projectile[] = [];
  particles: Particle[] = [];
  ambientCherry: Particle[] = [];
  exitGate: ToriiGate | null = null;

  scrollsFound = 0;
  cameraX = 0;
  levelWidth = 4000;

  playSound: (soundName: string) => void;

  constructor(playSound: (soundName: string) => void) {
    this.playSound = playSound;
    this.player = new Player();
    this.loadData();
    this.resetAmbient();
  }

  resetAmbient() {
    this.ambientCherry = [];
    for (let i = 0; i < 40; i++) {
      this.ambientCherry.push(new Particle(Math.random() * V_WIDTH, Math.random() * V_HEIGHT, 'cherry'));
    }
  }

  async loadData() {
    try {
      const g = await AsyncStorage.getItem('arashi_gold');
      const l = await AsyncStorage.getItem('arashi_level');
      const maxH = await AsyncStorage.getItem('arashi_maxHealth');
      const cd = await AsyncStorage.getItem('arashi_dashCooldownMax');
      const sL = await AsyncStorage.getItem('arashi_shurikenLevel');
      const mL = await AsyncStorage.getItem('arashi_meleeLevel');

      if (g !== null) this.gold = parseInt(g, 10);
      if (l !== null) this.levelUnlocked = parseInt(l, 10);
      
      if (maxH !== null) this.player.maxHealth = parseInt(maxH, 10);
      if (cd !== null) this.player.dashCooldownMax = parseInt(cd, 10);
      if (sL !== null) this.player.shurikenLevel = parseInt(sL, 10);
      if (mL !== null) this.player.meleeLevel = parseInt(mL, 10);
      this.player.health = this.player.maxHealth;
    } catch (e) {
      console.warn('Load data error', e);
    }
  }

  async saveData() {
    try {
      await AsyncStorage.setItem('arashi_gold', this.gold.toString());
      await AsyncStorage.setItem('arashi_level', this.levelUnlocked.toString());
      await AsyncStorage.setItem('arashi_maxHealth', this.player.maxHealth.toString());
      await AsyncStorage.setItem('arashi_dashCooldownMax', this.player.dashCooldownMax.toString());
      await AsyncStorage.setItem('arashi_shurikenLevel', this.player.shurikenLevel.toString());
      await AsyncStorage.setItem('arashi_meleeLevel', this.player.meleeLevel.toString());
    } catch (e) {
      console.warn('Save data error', e);
    }
  }

  startLevel(idx: number) {
    this.currentLevelIndex = idx;
    this.scene = 'play';
    this.scrollsFound = 0;
    this.particles = [];
    this.projectiles = [];
    this.coins = [];
    this.player.reset();

    this.platforms = [];
    this.enemies = [];
    this.chests = [];
    this.scrolls = [];
    this.traps = [];
    this.cameraX = 0;

    this.playSound('scroll');

    if (idx === 1) {
      this.levelWidth = 4200;
      this.platforms.push({x: 0, y: 600, w: 1200, h: 200});
      this.platforms.push({x: 1350, y: 600, w: 1400, h: 200});
      this.platforms.push({x: 2900, y: 600, w: 1300, h: 200});

      this.platforms.push({x: 350, y: 470, w: 220, h: 25});
      this.platforms.push({x: 700, y: 390, w: 250, h: 25});
      this.platforms.push({x: 1600, y: 460, w: 300, h: 25});
      this.platforms.push({x: 2100, y: 380, w: 250, h: 25});
      this.platforms.push({x: 3100, y: 470, w: 250, h: 25});
      this.platforms.push({x: 3450, y: 380, w: 300, h: 25});

      this.checkpoints = [
        new Checkpoint(1100, 530),
        new Checkpoint(2500, 530)
      ];

      this.scrolls.push(new Scroll(820, 310));
      this.scrolls.push(new Scroll(2220, 300));
      this.scrolls.push(new Scroll(3600, 300));

      this.chests.push(new Chest(420, 430));
      this.chests.push(new Chest(1750, 420));
      this.chests.push(new Chest(3200, 430));

      this.traps.push(new Trap(1200, 680, 'spikes'));
      this.traps.push(new Trap(1280, 680, 'spikes'));
      this.traps.push(new Trap(2750, 680, 'spikes'));
      this.traps.push(new Trap(2820, 680, 'spikes'));

      this.enemies.push(new Enemy(650, 500, 'guard'));
      this.enemies.push(new Enemy(1550, 500, 'guard'));
      this.enemies.push(new Enemy(2000, 500, 'archer'));
      this.enemies.push(new Enemy(3300, 500, 'guard'));
      this.enemies.push(new Enemy(3500, 300, 'archer'));

      this.exitGate = new ToriiGate(4000, 470);
    } 
    else if (idx === 2) {
      this.levelWidth = 5000;
      this.platforms.push({x: 0, y: 600, w: 800, h: 200});
      this.platforms.push({x: 950, y: 550, w: 1000, h: 200});
      this.platforms.push({x: 2100, y: 600, w: 1100, h: 200});
      this.platforms.push({x: 3400, y: 530, w: 1600, h: 200});

      this.platforms.push({x: 250, y: 460, w: 180, h: 25});
      this.platforms.push({x: 1200, y: 400, w: 300, h: 25});
      this.platforms.push({x: 2300, y: 450, w: 250, h: 25});
      this.platforms.push({x: 2600, y: 340, w: 250, h: 25});
      this.platforms.push({x: 3700, y: 420, w: 280, h: 25});
      this.platforms.push({x: 4100, y: 320, w: 250, h: 25});

      this.checkpoints = [
        new Checkpoint(700, 530),
        new Checkpoint(3000, 530)
      ];

      this.scrolls.push(new Scroll(300, 380));
      this.scrolls.push(new Scroll(2720, 260));
      this.scrolls.push(new Scroll(4220, 240));

      this.chests.push(new Chest(1350, 360));
      this.chests.push(new Chest(3800, 380));

      this.traps.push(new Trap(800, 680, 'spikes'));
      this.traps.push(new Trap(3200, 680, 'spikes'));
      this.traps.push(new Trap(1450, 180, 'saw'));
      this.traps.push(new Trap(3850, 140, 'saw'));

      this.enemies.push(new Enemy(450, 500, 'guard'));
      this.enemies.push(new Enemy(1250, 480, 'spear'));
      this.enemies.push(new Enemy(1700, 480, 'archer'));
      this.enemies.push(new Enemy(2400, 500, 'guard'));
      this.enemies.push(new Enemy(2700, 270, 'spear'));
      this.enemies.push(new Enemy(3600, 460, 'guard'));
      this.enemies.push(new Enemy(4300, 460, 'spear'));

      this.exitGate = new ToriiGate(4800, 400);
    } 
    else if (idx === 3) {
      this.levelWidth = 5200;
      this.platforms.push({x: 0, y: 600, w: 1000, h: 200});
      this.platforms.push({x: 1150, y: 600, w: 1200, h: 200});
      this.platforms.push({x: 2500, y: 550, w: 1000, h: 200});
      this.platforms.push({x: 3700, y: 600, w: 1500, h: 200});

      this.platforms.push({x: 400, y: 460, w: 200, h: 25});
      this.platforms.push({x: 1400, y: 440, w: 300, h: 25});
      this.platforms.push({x: 1800, y: 350, w: 250, h: 25});
      this.platforms.push({x: 2800, y: 410, w: 300, h: 25});

      this.checkpoints = [
        new Checkpoint(900, 530),
        new Checkpoint(2300, 530),
        new Checkpoint(3600, 480)
      ];

      this.scrolls.push(new Scroll(500, 380));
      this.scrolls.push(new Scroll(1920, 270));
      this.scrolls.push(new Scroll(2950, 330));

      this.chests.push(new Chest(1500, 400));
      this.chests.push(new Chest(2700, 480));

      this.traps.push(new Trap(1000, 680, 'spikes'));
      this.traps.push(new Trap(1650, 160, 'saw'));
      this.traps.push(new Trap(2380, 680, 'spikes'));
      this.traps.push(new Trap(3550, 680, 'spikes'));

      this.enemies.push(new Enemy(600, 500, 'guard'));
      this.enemies.push(new Enemy(1300, 500, 'spear'));
      this.enemies.push(new Enemy(1600, 370, 'archer'));
      this.enemies.push(new Enemy(2050, 500, 'spear'));
      this.enemies.push(new Enemy(2600, 480, 'guard'));
      this.enemies.push(new Enemy(3100, 480, 'archer'));
      this.enemies.push(new Enemy(4400, 450, 'oni'));

      this.exitGate = new ToriiGate(5000, 470);
    }
    else {
      // Procedural generation for levels 4 to 15
      this.levelWidth = 4000 + idx * 350;
      
      let seed = idx * 987.65;
      const rnd = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      let currentX = 0;
      const groundY = 600;
      const groundPlats: {x: number, y: number, w: number, h: number}[] = [];
      
      const startW = 800;
      const startPlat = { x: 0, y: groundY, w: startW, h: 200 };
      this.platforms.push(startPlat);
      groundPlats.push(startPlat);
      currentX += startW;

      while (currentX < this.levelWidth - 1000) {
        const gapW = 120 + Math.floor(rnd() * 80);
        this.traps.push(new Trap(currentX + 10, groundY + 80, 'spikes'));
        if (gapW > 160) {
          this.traps.push(new Trap(currentX + 70, groundY + 80, 'spikes'));
        }
        currentX += gapW;

        const platW = 600 + Math.floor(rnd() * 600);
        const platY = groundY - (rnd() > 0.5 ? 0 : 50);
        const segment = { x: currentX, y: platY, w: platW, h: 200 + (groundY - platY) };
        this.platforms.push(segment);
        groundPlats.push(segment);

        if (groundPlats.length > 1 && groundPlats.length % 3 === 0 && currentX < this.levelWidth - 1500) {
          this.checkpoints.push(new Checkpoint(currentX + 100, platY - 70));
        }

        if (platW > 700) {
          const enemyType1 = rnd() > 0.5 ? 'guard' : 'spear';
          this.enemies.push(new Enemy(currentX + 200, platY - 60, enemyType1));
          
          if (platW > 900 && rnd() > 0.4) {
            const enemyType2 = rnd() > 0.6 ? 'spear' : 'guard';
            this.enemies.push(new Enemy(currentX + 500, platY - 60, enemyType2));
          }
        } else {
          this.enemies.push(new Enemy(currentX + platW / 2, platY - 60, rnd() > 0.7 ? 'spear' : 'guard'));
        }

        const floatCount = 1 + Math.floor(rnd() * 2);
        for (let f = 0; f < floatCount; f++) {
          const floatW = 150 + Math.floor(rnd() * 100);
          const floatX = currentX + 50 + rnd() * (platW - floatW - 100);
          const floatY = platY - 120 - Math.floor(rnd() * 100);
          this.platforms.push({ x: floatX, y: floatY, w: floatW, h: 25 });

          const roll = rnd();
          if (roll < 0.25) {
            this.scrolls.push(new Scroll(floatX + floatW / 2 - 16, floatY - 50));
          } else if (roll < 0.45) {
            this.chests.push(new Chest(floatX + floatW / 2 - 25, floatY - 40));
          } else if (roll < 0.8) {
            this.enemies.push(new Enemy(floatX + floatW / 2 - 20, floatY - 60, 'archer'));
          }

          if (rnd() > 0.75) {
            const sawY = floatY - 120;
            const sawTrap = new Trap(floatX, sawY, 'saw');
            sawTrap.range = 100 + rnd() * 150;
            sawTrap.speed = 0.015 + rnd() * 0.015;
            this.traps.push(sawTrap);
          }
        }

        currentX += platW;
      }

      const endPlat = { x: currentX, y: groundY, w: this.levelWidth - currentX, h: 200 };
      this.platforms.push(endPlat);

      while (this.scrolls.length < 3) {
        const scrollX = 800 + rnd() * (this.levelWidth - 1800);
        const plat = this.platforms.find(p => scrollX >= p.x && scrollX <= p.x + p.w);
        if (plat) {
          this.scrolls.push(new Scroll(scrollX, plat.y - 120));
        } else {
          this.scrolls.push(new Scroll(scrollX, 350));
        }
      }

      while (this.chests.length < 2) {
        const chestX = 800 + rnd() * (this.levelWidth - 1800);
        const plat = this.platforms.find(p => chestX >= p.x && chestX <= p.x + p.w);
        if (plat) {
          this.chests.push(new Chest(chestX, plat.y - 40));
        }
      }

      if (idx === 15) {
        this.enemies.push(new Enemy(this.levelWidth - 750, groundY - 110, 'oni'));
      } else if (idx % 5 === 0) {
        this.enemies.push(new Enemy(this.levelWidth - 750, groundY - 110, 'oni'));
      }

      this.exitGate = new ToriiGate(this.levelWidth - 250, groundY - 130);
    }
  }

  update(keys: Record<string, boolean>, touches: Record<string, boolean>) {
    this.ambientCherry.forEach(p => p.update());
    
    if (this.scene === 'play') {
      this.player.update(keys, touches, this.platforms, this.particles, this.projectiles, this);

      const targetCamX = this.player.x - V_WIDTH / 2 + 100;
      this.cameraX += (targetCamX - this.cameraX) * 0.1;
      this.cameraX = Math.max(0, Math.min(this.levelWidth - V_WIDTH, this.cameraX));

      if (this.player.y > V_HEIGHT + 100) {
        this.player.takeDamage(1, this.player.x);
        if (!this.player.dead) {
          this.player.x = this.player.checkpointX || 100;
          this.player.y = this.player.checkpointY || 450;
          this.player.vx = 0;
          this.player.vy = 0;
        }
      }

      if (this.player.dead && this.player.y > V_HEIGHT + 200) {
        this.scene = 'gameover';
      }

      this.checkpoints.forEach(cp => cp.checkCollision(this.player, this.particles, this.playSound));
      this.scrolls.forEach(sc => sc.checkCollision(this.player, this, this.particles));

      this.coins.forEach(c => {
        if (c.active) {
          c.update(this.platforms);
          const dx = (this.player.x + 20) - c.x;
          const dy = (this.player.y + 30) - c.y;
          if (Math.sqrt(dx*dx + dy*dy) < 30) {
            c.active = false;
            this.gold += 10;
            this.playSound('coin');
            this.saveData();
            for (let i = 0; i < 4; i++) {
              this.particles.push(new Particle(c.x, c.y, 'spark'));
            }
          }
        }
      });
      this.coins = this.coins.filter(c => c.active);

      this.traps.forEach(tr => {
        tr.update();
        tr.checkCollision(this.player);
      });

      this.projectiles.forEach(proj => {
        proj.update();
        
        if (proj.x < 0 || proj.x > this.levelWidth || proj.y > V_HEIGHT) {
          proj.active = false;
        }

        if (proj.active) {
          if (proj.isEnemy) {
            const pCenterX = this.player.x + 20;
            const pCenterY = this.player.y + 30;
            const dx = proj.x - pCenterX;
            const dy = proj.y - pCenterY;
            if (Math.sqrt(dx*dx + dy*dy) < (proj.radius + 15)) {
              proj.active = false;
              this.player.takeDamage(1, proj.x);
            }
          } else {
            this.enemies.forEach(en => {
              if (en.active && proj.active) {
                const eCenterX = en.x + en.width/2;
                const eCenterY = en.y + en.height/2;
                const dx = proj.x - eCenterX;
                const dy = proj.y - eCenterY;
                if (Math.sqrt(dx*dx + dy*dy) < (proj.radius + en.width/2)) {
                  proj.active = false;
                  en.takeDamage(1, proj.x, this.particles, this.playSound);
                }
              }
            });
            
            this.chests.forEach(ch => {
              if (ch.active && proj.active) {
                const dx = proj.x - (ch.x + 25);
                const dy = proj.y - (ch.y + 20);
                if (Math.abs(dx) < 25 && Math.abs(dy) < 20) {
                  proj.active = false;
                  ch.destroy(this.particles, this);
                }
              }
            });
          }
        }
      });
      this.projectiles = this.projectiles.filter(p => p.active);

      this.enemies.forEach(en => en.update(this.player, this.platforms, this.projectiles, this.particles, this));
      
      this.enemies.forEach(en => {
        if (!en.active && !en.goldDropped) {
          en.goldDropped = true;
          this.gold += 30;
          this.saveData();
          this.coins.push(new Coin(en.x + en.width/2, en.y + 10, true));
        }
      });

      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.active);

      if (this.exitGate) {
        const exitGateCenterX = this.exitGate.x + 60;
        if (Math.abs((this.player.x + 20) - exitGateCenterX) < 45 && Math.abs((this.player.y + 30) - (this.exitGate.y + 65)) < 65) {
          const bossAlive = this.enemies.some(en => en.type === 'oni' && en.active);
          if (!bossAlive) {
            this.scene = 'clear';
            this.playSound('checkpoint');
            if (this.currentLevelIndex === this.levelUnlocked && this.levelUnlocked < 15) {
              this.levelUnlocked++;
              this.saveData();
            }
          }
        }
      }
    }
  }
}
