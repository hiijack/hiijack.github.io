function Enemy(context, enemyX) {
  this.context = context;
  this.x = enemyX;
  this.y = CONFIG.canvasPadding;
  this.status = 1; // 怪兽状态 0: dead, 1: alive, 2: dying
  this.frame = 0;
  this.size = CONFIG.enemySize;
}

Enemy.prototype = {
  constructor: Enemy,
  draw: function () {
    this.context.drawImage(this.image, this.x, this.y, this.size, this.size);
  },
  drawBoom: function () {
    var image = new Image();
    image.src = 'img/boom.png';
    var self = this;
    image.onload = function () {
      self.context.drawImage(image, self.x, self.y, this.size, this.size);
    }
  },
  clearDraw: function () {
    this.context.clearRect(this.x, this.y, this.size, this.size);
  },
  boom: function () {
    // 爆炸动画维持3帧才清除
    if (this.frame > 2) {
      cancelAnimationFrame(this.requestId);
      this.clearDraw();
      this.status = 0;
      return;
    }
    
    if (this.frame == 0) {
      var boomImage = new Image();
      boomImage.src = CONFIG.enemyBoomIcon;
      this.image = boomImage;
    }

    this.frame++;
    var self = this;
    this.requestId = requestAnimationFrame(function () {
      self.boom();
    });
  },
  init: function () {
    var image = new Image();
    image.src = CONFIG.enemyIcon;
    this.image = image;
    var self = this;
    image.onload = function () {
      self.draw();
    }
  }
}

// 怪兽团体
function EnemyGroup(context) {
  this.context = context;
  this.x = CONFIG.canvasPadding;
  this.y = CONFIG.canvasPadding;
  this.gap = CONFIG.enemyGap;
  this.enemySpeed = CONFIG.enemySpeed;
  this.number = CONFIG.numPerLine;  // 怪兽团体的个数
  this.direction = 0; // 怪兽移动的方向 0: right, 1: left, 2: down
  this.length =  this.number * CONFIG.enemySize + (this.number - 1) * this.gap; // 怪兽团体的总长度
}

EnemyGroup.prototype = {
  constructor: EnemyGroup,
  /**
   * 每次移动前，更新怪兽团体的x坐标和总长度
   */
  update() {
    var begin = -1;
    var end = -1;
    var first = false;
    for (var i = 0; i < enemies.length && !first; i++) {
      if (enemies[i].status != 0) {
        this.x = enemies[i].x;
        begin = i;
        first = true;
      }
    }

    // 找到第一个怪兽和最后一个怪兽的下标，计算总长度
    var last = false;
    for (var i = enemies.length - 1; i >= 0 && !last; i--) {
      if (enemies[i].status != 0) {
        last = true;
        end = i;
      }
    }
    this.length = (end - begin + 1) * CONFIG.enemySize + (end - begin) * this.gap;
  },
  move: function() {
    if (enemies.length == 0) {
      return;
    }
    if (this.y + CONFIG.enemyMoveDownGap > CONFIG.canvasHeight - CONFIG.planeSize.height - CONFIG.canvasBottomPadding) {
      GAME.setFail();
      return;
    }

    this.update();
    if (this.direction == 0 && this.x + this.length <= CONFIG.canvasWidth - CONFIG.canvasPadding) {
      this.clearDraw();
      this.moveRight();
    } else if (this.direction == 1 && this.x >= CONFIG.canvasPadding) {
      this.clearDraw();
      this.moveLeft();
    } else if (this.direction == 2) {
      this.clearDraw();
      this.moveDown();
    }
    
    var self = this;
    requestAnimationFrame(function() {
      self.move();
    });
  },
  moveRight: function() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].status != 0) {
        enemies[i].x += this.enemySpeed;
        enemies[i].draw();
      }
    }
    // 如果到达右边边界，将方向改为向下
    if (this.x + this.length + this.enemySpeed >= CONFIG.canvasWidth - CONFIG.canvasPadding) {
      this.direction = 2;
    }
    this.x += this.enemySpeed;
  },
  moveLeft: function() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].status != 0) {
        enemies[i].x -= this.enemySpeed;
        enemies[i].draw();
      }
    }
    // 如果到达左边边界，将方向改为向下
    if (this.x - this.enemySpeed <= CONFIG.canvasPadding) {
      this.direction = 2;
    }
    this.x -= this.enemySpeed;
  },
  moveDown: function() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].status != 0) {
        enemies[i].y += CONFIG.enemyMoveDownGap;
        enemies[i].draw();
      }
    }
    this.y += CONFIG.enemyMoveDownGap;
    // 改变方向
    if (this.x + this.length == CONFIG.canvasWidth - CONFIG.canvasPadding) {
      this.direction = 1;
    } else {
      this.direction = 0;
    }
  },
  clearDraw: function() {
    this.context.clearRect(CONFIG.canvasPadding, CONFIG.canvasPadding, 
      CONFIG.canvasWidth - 2 * CONFIG.canvasPadding, 
      CONFIG.canvasHeight - CONFIG.canvasPadding - CONFIG.canvasBottomPadding - CONFIG.planeSize.height);
  },
  init: function() {
    for (var i = 0; i < this.number; i++) {
      var enemy = new Enemy(this.context, this.x + i * (this.gap + CONFIG.enemySize));
      enemy.init();
      enemies.push(enemy);
    }
    this.move();
  }
}