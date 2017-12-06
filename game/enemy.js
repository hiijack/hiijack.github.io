(function(window) {

	/**
	  * 障碍
	  *
	  */
	function Enemy(img, stageWidth, stageHeight) {
		this.Bitmap_constructor(img);

		this.scaleX = stageWidth/480;
		this.scaleY = stageHeight/800;
	}

	var p = createjs.extend(Enemy, createjs.Bitmap);

	/**
	  * 障碍随时间的动画，均为向中心点移动。
	  */
	p.tick = function(e) {
		if (this.position == "left") {
			this.x += 2;	
		} else if (this.position == "right") {
			this.x -= 2;
		} else if (this.position == "top") {
			this.y += 2;
		} else {
			this.y -= 2;
		}
	}

	/**
	  * 初始化障碍的位置和撞击点
	  */
	p.setPosition = function(position) {
		this.position = position;
		if (position == "left") {
			this.x = 10 * this.scaleX;
			this.y = 325 * this.scaleY;
			this.hitX = 96;
			this.hitY = 70;
		} else if (position == "right") {
			this.x = 374 * this.scaleX;
			this.y = 325 * this.scaleY;
			this.hitX = 0;
			this.hitY = 70;
		} else if (position == "top") {
			this.x = 180 * this.scaleX;
			this.y = 170 * this.scaleY;
			this.hitX = 54;
			this.hitY = 88;
		} else {
			this.x = 200 * this.scaleX;
			this.y = 610 * this.scaleY;
			this.hitX = 40;
			this.hitY = 0;
		}
		
	}

	window.Enemy = createjs.promote(Enemy, "Bitmap");

})(window);