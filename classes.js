class PowerUp {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 60;
      this.height = 60;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Reverse direction if it hits the canvas borders
      if (this.x < 0 || this.x > canvas.width - this.width) {
        this.speedX = -this.speedX;
      }
      if (this.y < 0 || this.y > canvas.height - this.height) {
        this.speedY = -this.speedY;
      }
    }
  
    draw() {
      ctx.drawImage(powerUpImage, this.x, this.y, this.width, this.height);
    }
  }
  
  class ExtraLifePowerUp {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 60;
      this.height = 60;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Reverse direction if it hits the canvas borders
      if (this.x < 0 || this.x > canvas.width - this.width) {
        this.speedX = -this.speedX;
      }
      if (this.y < 0 || this.y > canvas.height - this.height) {
        this.speedY = -this.speedY;
      }
    }
  
    draw() {
      ctx.drawImage(extraLifeImg, this.x, this.y, this.width, this.height);
    }
  }
  
  class Projectile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 20;
      this.height = 20;
      this.speed = projectileSpeed;
    }
  
    update() {
      this.y -= this.speed;
    }
  
    draw() {
      ctx.drawImage(laserBeamImage, this.x, this.y, this.width, this.height);
    }
  }
  
  class EnemyProjectile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 10;
      this.speed = 4;
    }
  
    update() {
      this.y += this.speed;
    }
  
    draw() {
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  class EnemyProjectile2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 10;
      this.speed = 5;
    }
  
    update() {
      this.y += this.speed;
    }
  
    draw() {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  class ExplosionParticle {
    constructor(x, y, ctx, explosionImage, enemyWidth, enemyHeight) {
      this.x = x;
      this.y = y;
      this.ctx = ctx;
      this.explosionImage = explosionImage;
      this.enemyWidth = enemyWidth;
      this.enemyHeight = enemyHeight;
      this.size = 2;
      this.maxSize = 30;
      this.speed = 3;
      this.angle = Math.random() * Math.PI * 2;
      this.age = 0;
      this.opacity = 1;
      this.growthRate = 0.5;
      this.drawn = false;
    }
  
    update() {
      this.age++;
      this.size += this.growthRate;
  
      if (this.age <= explosionImageTime * 60) {
        this.opacity = Math.max(0, 1 - this.age / (explosionImageTime * 60));
      } else {
        this.opacity = 0;
      }
    }
  
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 4);
      this.ctx.fillStyle = `rgba(255, ${Math.floor(
        255 - (this.size * 255) / this.maxSize
      )}, 0, ${1 - this.size / this.maxSize})`;
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    drawExplosionImage() {
      if (!this.drawn) {
        this.ctx.drawImage(
          this.explosionImage,
          this.x - this.enemyWidth / 2,
          this.y - this.enemyHeight / 2,
          this.enemyWidth,
          this.enemyHeight
        );
        this.drawn = true;
      }
    }
  
    isMaxSize() {
      return this.size >= this.maxSize;
    }
  }
  