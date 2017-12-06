(function(window) {

	/**
	  * 小哥，定义了小哥的动作动画
	  *
	  */
	function Man(sprite, stageWidth, stageHeight) {
		var spritesheet = new createjs.SpriteSheet({
			images: [sprite],
			frames: [
				[0, 0, 95, 151],
				[95, 0, 116, 156, 0, 35, 0],
		        [211, 0, 115, 155, 0, -35, 0],
		        [326, 0, 94, 151, 0, -20, 20],
		        [430, 0, 90, 158, 0, -23, -20]
			],
			animations: {
				stand: 0,
				leftHit: [0, 1, 'stand', .4],
		        rightHit: {
		          frames: [0, 2],
		          next: 'stand',
		          speed: .4
		        },
		        topHit: {
		        	frames: [0, 3],
		        	next: "stand",
		        	speed: .4
		        },
		        bottomHit: {
		        	frames: [0, 4],
		        	next: "stand",
		        	speed: .4
		        }
			}
		});
		this.Sprite_constructor(spritesheet);

		this.scaleX = stageWidth/480;
		this.scaleY = stageHeight/800;

		this.x = 180 * this.scaleX;
		this.y = 305 * this.scaleY;
	}

	var p = createjs.extend(Man, createjs.Sprite);

 	/**
 	  * 检测小哥是否与障碍相撞
 	  */
	p.isHit = function(enemy) {
		var rc = enemy.localToLocal(enemy.hitX, enemy.hitY, this);
		return this.hitTest(rc.x, rc.y);
	}

	window.Man = createjs.promote(Man, "Sprite");

})(window);