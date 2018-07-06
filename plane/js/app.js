// 元素
var container = document.getElementById('game');

var enemies = []; 
var bullets = [];
var score = new Score();
score.init();

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opts) {
    this.status = CONFIG.status;
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    // 游戏结束，再玩一次和重新开始按钮的绑定
    var replayBtns = document.querySelectorAll('.js-replay');
    replayBtns.forEach(function(btn) {
      btn.onclick = function() {
        self.play();
      }
    });
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus('playing');
    this.setupScenes();
    score.reset();
  },
  /**
   * 初始化飞机，怪兽和定时器
   */
  setupScenes: function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var plane = new Plane(context);
    plane.init();

    var enemyGroup = new EnemyGroup(context);
    enemyGroup.init();

    var self = this;
    this.checker = setInterval(function() {
      self.check();
    }, 16);
  },
  /**
   * 游戏失败的处理
   */
  setFail: function() {
    this.resetCanvas();
    clearInterval(this.checker);
    enemies = [];
    this.setStatus('failed');
  },
  /**
   * 销毁之前的canvas，重新创建一个新的
   */
  resetCanvas() {
    var canvas = document.getElementById('canvas');
    canvas.remove();
    var nextCanvas = document.createElement('canvas');
    nextCanvas.width = 700;
    nextCanvas.height = 600;
    nextCanvas.id = 'canvas';
    document.getElementById('game').appendChild(nextCanvas);
  },
  areAllEnemiesDead: function() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].status != 0) {
        return false;
      }
    }
    return true;
  },
  /**
   * 创建一个定时器，不断地检查子弹和怪兽是否相撞
   */
  check: function() {
    if (this.areAllEnemiesDead()) {
      clearInterval(this.checker);
      enemies = [];
      this.resetCanvas();
      this.setStatus('all-success');
      return;
    }

    for (var i = 0; i < enemies.length; i++) {
      for (var j = 0; enemies[i].status == 1 && j < bullets.length; j++) {
        if (!(bullets[j].x < enemies[i].x) &&
            !(enemies[i].x + CONFIG.enemySize < bullets[j].x) && 
            !(enemies[i].y + CONFIG.enemySize < bullets[j].y - CONFIG.bulletSize)) {
              enemies[i].status = 2; // 被击中，怪兽处于正在死亡的状态
              score.add();
              bullets[j].boom();
              enemies[i].boom();
        }
      }
    }
  }
};


// 初始化
GAME.init();
