(function() {

	/**
	  * 初始化场景
	  */
	var stage = init();

	/**
	  * 预加载资源
	  */
	var queue = loading();
	var manifest = [
		{id: "startBg", src: "start-bg.png"},
		{id: "gameBg", src: "game-bg.png"},
		{id: "logo", src: "logo.png"},
		{id: "ruleLogo", src: "rule-logo.png"},
		{id: "rule", src: "rule.png"},
		{id: "ruleBtn", src: "rule-btn.png"},
		{id: "prize", src: "prize.png"},
		{id: "title", src: "title.png"},
		{id: "startBtn", src: "start-btn.png"},
		{id: "prepare", src: "prepare.png"},
		{id: "prepareBtn", src: "prepare-btn.png"},
		{id: "man", src: "man.png"},
		{id: "left", src: "left.png"},
		{id: "right", src: "right.png"},
		{id: "top", src: "top.png"},
		{id: "bottom", src: "bottom.png"},
		{id: "number", src: "number.png"},
		{id: "result", src: "result.png"},
		{id: "resultBtn", src: "result-btn.png"},
		{id: "countBg", src: "count-bg.png"},
		{id: "gameAg", src: "game-again.png"}
	];

	/**
	  * 当加载完成，进入游戏首页
	  */
	queue.addEventListener("complete", function() {
		newGame();
	});
	queue.loadManifest(manifest);

	/**
	  * 初始化
	  */
	function init() {
		var screenWidth = window.innerWidth;
		var screenHeight = window.innerHeight;

		var canvas = document.getElementById("gameCanvas");
		canvas.width = screenWidth;
		canvas.height = screenHeight;

		var stage = new createjs.Stage(canvas);
		createjs.Touch.enable(stage);
		return stage;
	}

	/**
	  * 定义加载界面，这里只是简单的文字和百分比
	  */
	function loading() {
		var loadingText = new createjs.Text("Loading", "48px Arial", "#FFF");
		loadingText.textAlign = "center";
		loadingText.maxWidth = 1000;
		loadingText.textBaseline = "middle";
		loadingText.x = stage.canvas.width/2;
		loadingText.y = stage.canvas.height/2;
		stage.addChild(loadingText);
		stage.update();

		var queue = new createjs.LoadQueue(true, "img/");
		queue.addEventListener("progress", updateLoading);

		function updateLoading() {
			loadingText.text = "Loading " + (queue.progress * 100 | 0) + "%";
			stage.update();
		}

		return queue;
	}

	/**
	  * 进入游戏首页，初始化各元素进入动画。
	  */
	function newGame() {
		var startBg = new createjs.Bitmap(queue.getResult("startBg"));
		startBg.x = -(480*1.1 - stage.canvas.width)/2;
		startBg.y = -(800*1.1 - stage.canvas.height)/2;
		startBg.scaleX = 1.1;
		startBg.scaleY = 1.1;
		createjs.Tween.get(startBg)
		.to({x: 0, y: 0, scaleX: stage.canvas.width/480, scaleY: stage.canvas.height/800}, 300, createjs.Ease.quadOut);

		var logo = addElement("logo", 30, -100);
		createjs.Tween.get(logo)
		.wait(200)
		.to(responsive({y: 30}), 200);

		var ruleLogo = addElement("ruleLogo", 382, -240);
		createjs.Tween.get(ruleLogo)
		.wait(200)
		.to({y: 0}, 200);
		ruleLogo.addEventListener('click', function(e) {
			var rule = addElement("rule");
			var ruleBtn = addElement("ruleBtn", 138, 691);
			ruleBtn.addEventListener('click', function(e) {
				stage.removeChild(rule);
				stage.removeChild(ruleBtn);
			});
			stage.addChild(rule);
			stage.addChild(ruleBtn);
		});

		var prize = addElement("prize", 70, -200);
		createjs.Tween.get(prize)
		.wait(900)
		.to(responsive({y: 40}), 200);

		var title = addElement("title", 50, -300);
		createjs.Tween.get(title)
		.wait(700)
		.to(responsive({y: 65}), 200)
		.wait(200)
		.to(responsive({y: 85}), 100)
		.to(responsive({y: 65}), 100);

		var startBtn = addElement("startBtn", 138, 691);
		startBtn.alpha = 0;
		createjs.Tween.get(startBtn)
		.wait(700)
		.to({alpha: 1}, 300);
		startBtn.addEventListener("click", function(e) {
			startGame();
			startBtn.removeAllEventListeners("click");
		});

		stage.addChild(startBg);
		stage.addChild(logo);
		stage.addChild(ruleLogo);
		stage.addChild(prize);
		stage.addChild(title);
		stage.addChild(startBtn);
		stage.update();
		createjs.Ticker.addEventListener("tick", tick);
	}

	var gameStarted = false;
	var enemyArr = [];
	var score = 0;
	var enemyBeat;
	var man;

	/**
	  * 处理游戏交互
	  */
	// 定义游戏结束条件
	var endGameScore = Math.floor(15 * Math.random()) + 2;
	function tick(e) {
		if (gameStarted) {
			enemyBeat.alpha = 1;
			// 当障碍数目小于3时，不断添加障碍
			if (enemyArr.length < 3) {
				addEnemy();
			}
			for (var i = 0; i < enemyArr.length; i++) {
				var obj = enemyArr[i];
				obj.tick(e);

				// 当小哥与障碍相撞，则删除该障碍，并增加得分
				if (man.isHit(obj)) {
					stage.removeChild(obj);
					enemyArr.splice(i, 1);
					score += 1;
					if (score > 9) {
						enemyBeat.x = 357 * enemyBeat.scaleX;
					}
					enemyBeat.text = score.toString();
				}
			}

			// 游戏结束处理
			if (score > endGameScore) {
				gameStarted = false;
				var result = addElement("result");
				stage.addChild(result);

				// 显示结果
				var scoreText = addText(score.toString(), 165, 308);
				stage.addChild(scoreText);

				// 发送得分结果，这里是模拟ajax发送
				var resultBtn = addElement("resultBtn", 138, 580);
				var handlePostResult = function() {
					sendResult(score, function() {
						var retResult = addText("结果已发送！", 118, 691);
						stage.addChild(retResult);
						resultBtn.removeAllEventListeners("click");
						stage.removeChild(resultBtn);

						// 再玩一次的处理
						var gameAgBtn = addElement("gameAg", 138, 580);
						gameAgBtn.addEventListener("click", function() {
							stage.removeChild(result);
							stage.removeChild(scoreText);
							stage.removeChild(resultBtn);
							stage.removeChild(retResult);
							stage.removeChild(gameAgBtn);

							endGameScore = Math.floor(15 * Math.random()) + 2;
							gameAgBtn.removeAllEventListeners("click");
							showCountDown();
							score = 0;
							enemyBeat.text = score.toString();
							enemyBeat.x = 370 * enemyBeat.scaleX;

							if (enemyArr.length > 0) {
								for (var j = 0; j < enemyArr.length; j++) {
									stage.removeChild(enemyArr[j]);
								}
								enemyArr = [];
							}
						});
						stage.addChild(gameAgBtn);
					});
				}

				resultBtn.addEventListener("click", handlePostResult);
				stage.addChild(resultBtn);
			}
		}
		stage.update(e);
	}

	/**
	  * 开始游戏，初始化准备界面和小哥
	  */
	var gamePlayed = false;
	function startGame() {
		stage.clear();
		var gameBg = addElement("gameBg");
		stage.addChild(gameBg);

		if (!gamePlayed) {
			var prepare = addElement("prepare");
			stage.addChild(prepare);

			var prepareBtn = addElement("prepareBtn", 138, 691);
			function handlePrepare() {
				prepareBtn.removeEventListener("click", handlePrepare);
				stage.removeChild(prepare);
				stage.removeChild(prepareBtn);

				// 倒数动画
				showCountDown();
			}
			prepareBtn.addEventListener("click", handlePrepare);
			stage.addChild(prepareBtn);
		}

		// 定义得分的动作动画
		var number = new createjs.SpriteSheet({
	    	images: [queue.getResult("number")],
	    	frames: [
	    	  [0, 0, 25, 39],
	    	  [25, 0, 27, 39],
	    	  [54, 0, 24, 39],
	    	  [78, 0, 30, 39],
	    	  [108, 0, 24, 39],
	    	  [132, 0, 28, 39],
	    	  [160, 0, 27, 39],
	    	  [187, 0, 27, 39],
	    	  [214, 0, 26, 39],
	    	  [240, 0, 27, 39]
	    	],
	    	animations: {
	    	  '1': 0,
	    	  '2': 1,
	    	  '3': 2,
	    	  '4': 3,
	    	  '5': 4,
	    	  '6': 5,
	    	  '7': 6,
	    	  '9': 7,
	    	  '8': 8,
	    	  '0': 9
	    	}
	    });
	    // 得分元素
	    enemyBeat = new createjs.BitmapText(score.toString(), number);
	    enemyBeat.scaleX = stage.canvas.width/480;
	    enemyBeat.scaleY = stage.canvas.height/800;
	    enemyBeat.x = 370 * enemyBeat.scaleX;
	    enemyBeat.y = 130 * enemyBeat.scaleY;
	    enemyBeat.alpha = 0;
	    stage.addChild(enemyBeat);

	    // 小哥元素
		man = new Man(queue.getResult("man"), stage.canvas.width, stage.canvas.height);
		var startPoint = {};
		man.addEventListener("mousedown", function(e) {
			startPoint.x = e.stageX;
			startPoint.y = e.stageY;
		});

		// 判断触摸点的水平和垂直距离，使小哥动起来
		man.addEventListener("pressmove", function(e) {
			if (e.stageX - startPoint.x < -80) {
          		man.gotoAndPlay('leftHit');
        	} else if (e.stageX - startPoint.x > 80) {
          		man.gotoAndPlay('rightHit');
        	} else if (e.stageY - startPoint.y < -50) {
        		man.gotoAndPlay('topHit');
        	} else if (e.stageY - startPoint.y > 50) {
        		man.gotoAndPlay('bottomHit');
        	}
        	stage.update();
		});
		stage.addChild(man);
		stage.update();
	}

	function showCountDown() {
		var countBg = addElement("countBg");
		stage.addChild(countBg);
		var three = addText("3", 222, 380);
		var two = addText("2", 222, 380);
		two.alpha = 0;
		var one = addText("1", 222, 380);
		one.alpha = 0;

		createjs.Tween.get(three).wait(1000).to({alpha: 0});
		createjs.Tween.get(two).wait(1000).to({alpha: 1}).wait(1000).to({alpha: 0});
		createjs.Tween.get(one).wait(2000).to({alpha: 1}).wait(1000).call(function() {
			stage.removeChild(countBg);
			stage.removeChild(three);
			stage.removeChild(two);
			stage.removeChild(one);
			gameStarted = true;
		});

		stage.addChild(three);
		stage.addChild(two);
		stage.addChild(one);
	}

	/**
	  * 添加障碍，随机添加各个位置的障碍
	  */
	function addEnemy() {
		var enemyType = ["left", "right", "top", "bottom"];
		var nextType = Math.floor((Math.random() * 10) % 4);

		var enemy = new Enemy(queue.getResult(enemyType[nextType]), stage.canvas.width, stage.canvas.height);
		enemy.setPosition(enemyType[nextType]);
		stage.addChild(enemy);
		enemyArr.push(enemy);
	}

	/**
	  * 添加首页元素
	  */
	function addElement(id, x, y) {
		var element = new createjs.Bitmap(queue.getResult(id));
		var xRatio = stage.canvas.width/480;
		var yRatio = stage.canvas.height/800;
		element.scaleX = xRatio;
		element.scaleY = yRatio;
		if (x) {
			element.x = x * xRatio;
		}
		if (y) {
			element.y = y = y * yRatio;
		}
		return element;
	}

	function addText(text, x, y) {
		var text = new createjs.Text(text, "48px Arial", "#FFF");
		text.x = x * stage.canvas.width/480;
		text.y = y * stage.canvas.height/800;
		text.scaleX = stage.canvas.width/480;
		text.scaleY = stage.canvas.height/800;
		return text;
	}

	/**
	  * 自适应坐标，适用不同屏幕
	  */
	function responsive(position) {
		var responsivePo = {};
		if (position.x) {
			responsivePo.x = position.x * stage.canvas.width/480;
		}
		if (position.y) {
			responsivePo.y = position.y * stage.canvas.height/800;
		}
		return responsivePo;
	}

	function sendResult(result, callback) {
		// 模拟ajax
		Mock.mock(/\.do/, 'post', {
    		ret: "ok"
		});

		$.post("postResult.do", {
			result: result
		}, function(data) {
			if (data.ret == "ok") {
				callback();
			} else {
				console.log("error");
			}
		}, "json");
	}
})();