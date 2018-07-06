function Bullet(context, plane) {
  this.context = context;
  this.x = plane.x + plane.width / 2;
  this.y = plane.y;
  this.speed = CONFIG.bulletSpeed;
  this.size = CONFIG.bulletSize;
}

Bullet.prototype = {
  constructor: Bullet,
  draw: function () {
    this.context.beginPath();
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 1;
    this.context.moveTo(this.x, this.y - this.size);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
  },
  clearDraw: function () {
    this.context.clearRect(this.x - 1, this.y - this.size, 2, this.size);
  },
  fly: function () {
    if (this.y <= CONFIG.canvasPadding) {
      cancelAnimationFrame(this.requestId);
      this.clearDraw();
      bullets.shift();
      return;
    }
    
    this.clearDraw();
    this.y -= this.speed;
    this.draw();
    var self = this;
    this.requestId = requestAnimationFrame(function () {
      self.fly();
    });
  },
  boom: function () {
    cancelAnimationFrame(this.requestId);
    this.clearDraw();
    bullets.shift();
  },
  init: function () {
    this.draw();
    this.fly();
  }
}