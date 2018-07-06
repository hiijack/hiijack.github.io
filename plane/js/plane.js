function Plane(context) {
  this.context = context;
  this.x = (CONFIG.canvasWidth - CONFIG.planeSize.width) / 2;
  this.y = CONFIG.canvasHeight - CONFIG.canvasBottomPadding - CONFIG.planeSize.height;
  this.width = CONFIG.planeSize.width;
  this.height = CONFIG.planeSize.height;
  this.plandSpeed = CONFIG.planeSpeed;
}

Plane.prototype = {
  constructor: Plane,
  draw: function () {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
  },
  clearDraw: function () {
    this.context.clearRect(CONFIG.canvasPadding, 
      CONFIG.canvasHeight - this.height - CONFIG.canvasBottomPadding, 
      CONFIG.canvasWidth - 2 * CONFIG.canvasPadding, 
      this.height);
  },
  // 发射子弹，每个子弹都会放在数组中，用于判断是否击中怪兽
  shoot: function () {
    var bullet = new Bullet(this.context, this);
    bullet.init();
    bullets.push(bullet);
  },
  moveLeft: function () {
    if (this.x - this.plandSpeed > CONFIG.canvasPadding) {
      this.clearDraw();
      this.x -= this.plandSpeed;
      this.draw();
    }
  },
  moveRight: function () {
    if (this.x + this.width + this.plandSpeed < CONFIG.canvasWidth - CONFIG.canvasPadding) {
      this.clearDraw();
      this.x += this.plandSpeed;
      this.draw();
    }
  },
  initMove: function () {
    var self = this;
    document.onkeydown = function (e) {
      var key = e.keyCode || e.which || e.charCode;
      switch (key) {
        case 37:
          self.moveLeft();
          break;
        case 39:
          self.moveRight();
          break;
        case 32:
          self.shoot();
          break;
      }
    }
  },
  init: function () {
    var image = new Image();
    image.src = CONFIG.planeIcon;
    this.image = image;
    var self = this;
    image.onload = function () {
      self.draw();
    }
    this.initMove();
  }
}