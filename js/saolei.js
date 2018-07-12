var map = new Array();
var emptyMap = new Array();
var flagMap = new Array();

function Minesweeper() {
	//------config 
	this.$ctn = $('.game-ctn');
	this.$num = 18;
	this.$mNum = 50;
	this.$overNum = 50;
	this.$firstFlag = false;
	this.$elem = $('.Block');
	this.$firstClick = null;
	this.$secondClick = null;
	this.$checkFlag = false;
	this.$time = 0;
}
Minesweeper.prototype = {
	constructor: Minesweeper,
	_initBlock: function _initBlock() {
		var $ctn = this.$ctn;
		var $num = this.$num;
		for(var i = 0; i < $num; i++) {
			emptyMap[i] = new Array();
			flagMap[i] = new Array();
			for(var j = 0; j < $num; j++) {
				emptyMap[i][j] = 0;
				flagMap[i][j] = 0;
			}
		}
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				(function(i, j) {
					var $sBlock = $("<div class='Block sBlock'></div>");
					$ctn.append($sBlock);
					$sBlock.animate({
						'opacity': '0.9'
					}, 50 * (100 - i * 3 - j * 4));
				})(i, j);
			}
		}
	},
	_initMap: function _initMap(numX, numY) {
		var $num = this.$num;
		var $Mnum = this.$mNum;
		//首次置零
		for(var i = 0; i < $num; i++) {
			map[i] = new Array();
			for(var j = 0; j < $num; j++) {
				map[i][j] = 0;
			}
		}
		//避免首次点击是地雷
		//随机区域
		//一次随机
		var $arraySquare = 1;
		this._randomClickArray(numX, numY, $arraySquare);
		//一次赋值
		//将展开地区的周围设为非雷区
		this._setMapClickArray();
		//二次随机
		//随机地雷位置
		var randomNumX = parseInt(Math.random() * 17);
		var randomNumY = parseInt(Math.random() * 17);
		for(var i = 0; i < $Mnum; i++) {
			this._randomArray(randomNumX, randomNumY);
		}
		//二次赋值
		//雷域
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				if(map[i][j] == 0 || map[i][j] == -3) {
					this._setMap(i, j);
				}
			}
		}
	},
	_randomClickArray: function _randomClickArray(numX, numY, arrayNum) {
		var randomNumX = numX;
		var randomNumY = numY;
		var $firstFlag = this.$firstFlag;
		var $squareNum = void 0;
		if(arrayNum < 0) return;
		//越过边界
		if(!(numX < 0 || numX > 17 || numY < 0 || numY > 17)) {
			//重复遍历
			if(map[numX][numY] == -2) $squareNum = arrayNum;
			else {
				map[numX][numY] = -2;
				var $squareNum = arrayNum - 1;
			}
		} else {
			//溯回越界
			if(numX < 0) numX = 0;
			if(numX > 17) numX = 17;
			if(numY < 0) numY = 0;
			if(numY > 17) numY = 17;
			$squareNum = arrayNum;
		}
		//点击处八面不允许出现地雷
		if(!$firstFlag) {
			var i = numX;
			var j = numY;
			if(i != 17 && j == 17 && i != 0) {
				this._checkMineMap(i + 1, j);
				this._checkMineMap(i + 1, j - 1);
				this._checkMineMap(i - 1, j);
				this._checkMineMap(i - 1, j - 1);
			}
			if(j != 17 && i == 17 && j != 0) {
				this._checkMineMap(i, j + 1);
				this._checkMineMap(i - 1, j + 1);
				this._checkMineMap(i, j - 1);
				this._checkMineMap(i - 1, j - 1);
			}
			if(j != 17 && i == 0 && j != 0) {
				this._checkMineMap(i, j + 1);
				this._checkMineMap(i + 1, j + 1);
				this._checkMineMap(i, j - 1);
				this._checkMineMap(i + 1, j - 1);
			}
			if(i != 17 && j == 0 && i != 0) {
				this._checkMineMap(i + 1, j);
				this._checkMineMap(i + 1, j + 1);
				this._checkMineMap(i - 1, j);
				this._checkMineMap(i - 1, j + 1);
			}
			if(i == 17 && j == 17) {
				this._checkMineMap(i, j - 1);
				this._checkMineMap(i - 1, j);
				this._checkMineMap(i - 1, j - 1);
			}
			if(i == 0 && j == 0) {
				this._checkMineMap(i, j + 1);
				this._checkMineMap(i + 1, j + 1);
				this._checkMineMap(i + 1, j);
			}
			if(i == 17 && j == 0) {
				this._checkMineMap(i, j + 1);
				this._checkMineMap(i - 1, j + 1);
				this._checkMineMap(i - 1, j);
			}
			if(i == 0 && j == 17) {
				this._checkMineMap(i, j - 1);
				this._checkMineMap(i + 1, j - 1);
				this._checkMineMap(i + 1, j);
			}
			if(j != 17 && i != 17 && i != 0 && j != 0) {
				this._checkMineMap(i, j + 1);
				this._checkMineMap(i + 1, j);
				this._checkMineMap(i + 1, j + 1);
				this._checkMineMap(i - 1, j + 1);
				this._checkMineMap(i + 1, j - 1);
				this._checkMineMap(i - 1, j);
				this._checkMineMap(i, j - 1);
				this._checkMineMap(i - 1, j - 1);
			}
			this.$firstFlag = true;
		}
		//随机方向
		//		//左
		//		if(map[numX - 1][numY] === -1) coutNum++;
		//		//右
		//		if(map[numX + 1][numY] === -1) coutNum++;
		//		//下
		//		if(map[numX][numY + 1] === -1) coutNum++;
		//		//上
		//		if(map[numX][numY - 1] === -1) coutNum++;
		//		//右上
		//		if(map[numX + 1][numY - 1] === -1) coutNum++;
		//		//右下
		//		if(map[numX + 1][numY + 1] === -1) coutNum++;
		//		//左下
		//		if(map[numX - 1][numY + 1] === -1) coutNum++;
		//		//左上
		//		if(map[numX - 1][numY - 1] === -1) coutNum++;
		var $randomDir = Math.floor(Math.random() * 4);
		if($randomDir == 4) $randomDir = 3;
		switch($randomDir) {
			case 0:
				this._randomClickArray(numX - 1, numY, $squareNum);
				break;
			case 1:
				this._randomClickArray(numX + 1, numY, $squareNum);
				break;
			case 2:
				this._randomClickArray(numX, numY + 1, $squareNum);
				break;
			case 3:
				this._randomClickArray(numX, numY - 1, $squareNum);
				break;
				/*case 4:
					this._randomClickArray(numX + 1, numY - 1, $squareNum);
					break;
				case 5:
					this._randomClickArray(numX + 1, numY + 1, $squareNum);
					break;
				case 6:
					this._randomClickArray(numX - 1, numY - 1, $squareNum);
					break;
				case 7:
					this._randomClickArray(numX - 1, numY + 1, $squareNum);
					break;
				*/
			default:
				return;
				break;
		}

	},
	_checkMineMap: function _checkMineMap(x, y) {
		map[x][y] = -2;
	},
	_setMapClickArray: function _setMapClickArray() {
		var $num = this.$num;
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				if(map[i][j] == -2) {
					try {
						//阻止扩展数组操作
						if(i != 17 && j == 17 && i != 0) {
							this._checkArrayNum(i + 1, j);
							this._checkArrayNum(i + 1, j - 1);
							this._checkArrayNum(i - 1, j);
							this._checkArrayNum(i - 1, j - 1);
						}
						if(j != 17 && i == 17 && j != 0) {
							this._checkArrayNum(i, j + 1);
							this._checkArrayNum(i - 1, j + 1);
							this._checkArrayNum(i, j - 1);
							this._checkArrayNum(i - 1, j - 1);
						}
						if(j != 17 && i == 0 && j != 0) {
							this._checkArrayNum(i, j + 1);
							this._checkArrayNum(i + 1, j + 1);
							this._checkArrayNum(i, j - 1);
							this._checkArrayNum(i + 1, j - 1);
						}
						if(i != 17 && j == 0 && i != 0) {
							this._checkArrayNum(i + 1, j);
							this._checkArrayNum(i + 1, j + 1);
							this._checkArrayNum(i - 1, j);
							this._checkArrayNum(i - 1, j + 1);
						}
						if(i == 17 && j == 17) {
							this._checkArrayNum(i, j - 1);
							this._checkArrayNum(i - 1, j);
							this._checkArrayNum(i - 1, j - 1);
						}
						if(i == 0 && j == 0) {
							this._checkArrayNum(i, j + 1);
							this._checkArrayNum(i + 1, j + 1);
							this._checkArrayNum(i + 1, j);
						}
						if(i == 17 && j == 0) {
							this._checkArrayNum(i, j + 1);
							this._checkArrayNum(i - 1, j + 1);
							this._checkArrayNum(i - 1, j);
						}
						if(i == 0 && j == 17) {
							this._checkArrayNum(i, j - 1);
							this._checkArrayNum(i + 1, j - 1);
							this._checkArrayNum(i + 1, j);
						}
						if(j != 17 && i != 17 && i != 0 && j != 0) {
							this._checkArrayNum(i, j + 1);
							this._checkArrayNum(i + 1, j);
							this._checkArrayNum(i + 1, j + 1);
							this._checkArrayNum(i - 1, j + 1);
							this._checkArrayNum(i + 1, j - 1);
							this._checkArrayNum(i - 1, j);
							this._checkArrayNum(i, j - 1);
							this._checkArrayNum(i - 1, j - 1);
						}
					} catch(e) {
						//无视越界操作
					}
				}
			}
		}
	},
	_checkArrayNum: function _checkArrayNum(numX, numY) {
		if(map[numX][numY] == -2) return;
		else map[numX][numY] = -3;
	},
	_randomArray: function _randomArray(numX, numY) {
		var randomNumX = numX;
		var randomNumY = numY;
		//console.log(map);
		if(randomNumX === 18) randomNumX = 17;
		if(randomNumY === 18) randomNumY = 17;
		if(map[randomNumX][randomNumY] == 0) {
			map[randomNumX][randomNumY] = -1;
			return;
		} else {
			randomNumX = Math.floor(Math.random() * 18);
			randomNumY = Math.floor(Math.random() * 18);
			this._randomArray(randomNumX, randomNumY);
		}
	},
	_setMap: function _setMap(numX, numY) {
		if(map[numX][numY] != 0 && map[numX][numY] != -3) return;
		map[numX][numY] = 0;
		var coutNum = 0;
		//八向寻值
		//边框判定
		//边框值 numX17 numY17 numX0 numY0
		if(numX == 0 && numY != 0 && numY != 17) {
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
			//右上
			if(map[numX + 1][numY - 1] === -1) coutNum++;
			//右下
			if(map[numX + 1][numY + 1] === -1) coutNum++;
		} else if(numX == 0 && numY == 0) {
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//右下
			if(map[numX + 1][numY + 1] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
		} else if(numX != 0 && numY == 0 && numX != 17) {
			//左下
			if(map[numX - 1][numY + 1] === -1) coutNum++;
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//右下
			if(map[numX + 1][numY + 1] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
		} else if(numX == 17 && numY == 17) {
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//左上
			if(map[numX - 1][numY - 1] === -1) coutNum++;
		} else if(numX == 17 && numY == 0) {
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
			//左下
			if(map[numX - 1][numY + 1] === -1) coutNum++;
		} else if(numX == 0 && numY == 17) {
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
			//右上
			if(map[numX + 1][numY - 1] === -1) coutNum++;
		} else if(numY == 17 && numX != 0 && numX != 17) {
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//上左
			if(map[numX - 1][numY - 1] === -1) coutNum++;
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
			//右上
			if(map[numX + 1][numY - 1] === -1) coutNum++;
		} else if(numY != 0 && numY != 17 && numX == 17) {
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//左下
			if(map[numX - 1][numY + 1] === -1) coutNum++;
			//左上
			if(map[numX - 1][numY - 1] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
		} else {
			//左
			if(map[numX - 1][numY] === -1) coutNum++;
			//右
			if(map[numX + 1][numY] === -1) coutNum++;
			//下
			if(map[numX][numY + 1] === -1) coutNum++;
			//上
			if(map[numX][numY - 1] === -1) coutNum++;
			//右上
			if(map[numX + 1][numY - 1] === -1) coutNum++;
			//右下
			if(map[numX + 1][numY + 1] === -1) coutNum++;
			//左下
			if(map[numX - 1][numY + 1] === -1) coutNum++;
			//左上
			if(map[numX - 1][numY - 1] === -1) coutNum++;
		}
		map[numX][numY] = coutNum;
	},
	//连通判定,展开空白区
	//不寻找斜角联通
	_linkEmpty: function _linkEmpty(numX, numY) {
		//四向寻值
		try {
			//阻止扩展数组操作,剪枝
			/*if(numX != 17 && numY == 17) {
				this._checkEmpty(numX + 1, numY);
				this._checkEmpty(numX + 1, numY - 1);
			}
			if(numY != 17 && numX == 17) {
				this._checkEmpty(numX, numY + 1);
				this._checkEmpty(numX - 1, numY + 1);
			}
			if(numY != 17 && numX != 17) {
				this._checkEmpty(numX, numY + 1);
				this._checkEmpty(numX - 1, numY + 1);
				this._checkEmpty(numX + 1, numY);
				this._checkEmpty(numX + 1, numY - 1);
				this._checkEmpty(numX + 1, numY + 1);
			}
			this._checkEmpty(numX - 1, numY);
			this._checkEmpty(numX - 1, numY - 1);
			this._checkEmpty(numX, numY - 1);
			if(numX != 17 && numY == 17 && numY != 0) {
				this._checkEmpty(numX + 1, numY);
				this._checkEmpty(numX - 1, numY);
				this._checkEmpty(numX, numY - 1);
			} else if(numX == 17 && numY != 17 && numY != 0) {
				this._checkEmpty(numX - 1, numY);
				this._checkEmpty(numX, numY - 1);
				this._checkEmpty(numX, numY + 1);
			} else if(numX != 17 && numY != 17 && numX != 0 && numY != 0) {
				this._checkEmpty(numX - 1, numY);
				this._checkEmpty(numX + 1, numY);
				this._checkEmpty(numX, numY - 1);
				this._checkEmpty(numX, numY + 1);
			} else if(numX != 17 && numX != 0 && numY == 0) {
				this._checkEmpty(numX - 1, numY);
				this._checkEmpty(numX + 1, numY);
				this._checkEmpty(numX, numY + 1);
			}*/

			if(numX < 17) {
				this._checkEmpty(numX + 1, numY);
			}
			if(numY < 17) {
				this._checkEmpty(numX, numY + 1);
			}
			if(numX > 0) {
				this._checkEmpty(numX - 1, numY);
			}
			if(numY > 0) {
				this._checkEmpty(numX, numY - 1);
			}
		} catch(e) {
			//TODO handle the exception
		}
	},
	_checkEmpty: function _checkEmpty(numX, numY) {
		//var $elem = this.$elem;
		if(emptyMap[numX][numY] == 0 && (map[numX][numY] == -2 || map[numX][numY] == 0)) {
			emptyMap[numX][numY] = 1;
			var $blockPosition = numX * 18 + numY;
			//console.log($blockPosition);
			//console.log($($('.Block')[$blockPosition]));
			var $elemBlock = $($('.Block')[$blockPosition]);
			setTimeout(function() {
				$elemBlock.removeClass();
				$elemBlock.addClass("Block eBlock");
			}, $blockPosition * 0.5);
			/*
			$('.Block')[$blockPosition].removeClass();
			$('.Block')[$blockPosition].addClass("Block eBlock");*/

			this._linkEmpty(numX, numY);
			return true;
		}
		return false;
	},
	_setEmptyMap: function _setEmptyMap() {
		var $num = this.$num;
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				if(emptyMap[i][j] == 1) {
					try {
						//阻止扩展数组操作
						if(i != 17 && j == 17 && i != 0) {
							this._checkEmptyMap(i + 1, j);
							this._checkEmptyMap(i + 1, j - 1);
							this._checkEmptyMap(i - 1, j);
							this._checkEmptyMap(i - 1, j - 1);
						}
						if(j != 17 && i == 17 && j != 0) {
							this._checkEmptyMap(i, j + 1);
							this._checkEmptyMap(i - 1, j + 1);
							this._checkEmptyMap(i, j - 1);
							this._checkEmptyMap(i - 1, j - 1);
						}
						if(j != 17 && i == 0 && j != 0) {
							this._checkEmptyMap(i, j + 1);
							this._checkEmptyMap(i + 1, j + 1);
							this._checkEmptyMap(i, j - 1);
							this._checkEmptyMap(i + 1, j - 1);
						}
						if(i != 17 && j == 0 && i != 0) {
							this._checkEmptyMap(i + 1, j);
							this._checkEmptyMap(i + 1, j + 1);
							this._checkEmptyMap(i - 1, j);
							this._checkEmptyMap(i - 1, j + 1);
						}
						if(i == 17 && j == 17) {
							this._checkEmptyMap(i, j - 1);
							this._checkEmptyMap(i - 1, j);
							this._checkEmptyMap(i - 1, j - 1);
						}
						if(i == 0 && j == 0) {
							this._checkEmptyMap(i, j + 1);
							this._checkEmptyMap(i + 1, j + 1);
							this._checkEmptyMap(i + 1, j);
						}
						if(i == 17 && j == 0) {
							this._checkEmptyMap(i, j + 1);
							this._checkEmptyMap(i - 1, j + 1);
							this._checkEmptyMap(i - 1, j);
						}
						if(i == 0 && j == 17) {
							this._checkEmptyMap(i, j - 1);
							this._checkEmptyMap(i + 1, j - 1);
							this._checkEmptyMap(i + 1, j);
						}
						if(j != 17 && i != 17 && i != 0 && j != 0) {
							this._checkEmptyMap(i, j + 1);
							this._checkEmptyMap(i + 1, j);
							this._checkEmptyMap(i + 1, j + 1);
							this._checkEmptyMap(i - 1, j + 1);
							this._checkEmptyMap(i + 1, j - 1);
							this._checkEmptyMap(i - 1, j);
							this._checkEmptyMap(i, j - 1);
							this._checkEmptyMap(i - 1, j - 1);
						}
					} catch(e) {
						//无视越界操作
					}
				}
			}
		}
	},
	_checkEmptyMap: function _checkEmptyMap(numX, numY) {
		//不接受边角0值
		if(emptyMap[numX][numY] == 1 || map[numX][numY] == 0) return;
		else {
			var $blockPosition = numX * 18 + numY;
			var $elemBlock = $($('.Block')[$blockPosition]);
			var $textspan = $("<span></span>");
			setTimeout(function() {
				$elemBlock.removeClass();
				$elemBlock.addClass("Block enBlock");
				$textspan.text(map[numX][numY]);
				//console.log($elemBlock);
				if($elemBlock[0].children.length == 0) {
					if(map[numX][numY] == 1) $textspan.css("color", "#2E6DA4");
					else if(map[numX][numY] == 2) $textspan.css("color", "#5CB85C");
					else if(map[numX][numY] == 3) $textspan.css("color", "#C9302C");
					else if(map[numX][numY] == 4) $textspan.css("color", "#D58512");
					else $textspan.css("color", "#EEA236");
					$elemBlock.append($textspan);
				}
			}, $blockPosition * 1.5);
			emptyMap[numX][numY] = 2;
		}
	},
	//初始点击
	_clickStart: function _Click(e) {
		var $firstFlag = this.$firstFlag;
		if(!$firstFlag) {
			var $index = $('.sBlock').index($(e.target));
			var $clickX = Math.floor($index / 18);
			var $clickY = $index % 18;
			console.log($clickX, $clickY);
			//这里XY轴反轴，索引位置与数组不一样
			//排数是X，列数是Y
			this._initMap($clickX, $clickY);
			this._linkEmpty($clickX, $clickY);
			this._setEmptyMap();
			console.log(map);
			console.log(emptyMap);
			this.$firstFlag = true;
			$firstFlag = true;
		}
		//打开计时器
		this._showTime(0);
	},
	_showTime: function _showTime(time) {
		console.log(time);
		time = time + 1;
		$('.time-body').text(time);
		this.$clock = setTimeout(function() {
			_showTime(time);
		}, 1000);
	},
	//点击雷区
	_clickMines: function _ClickMines(e, index) {
		var $num = this.$num;
		if(e == null && index == null) return;
		if(e != null) {
			var $elemBlock = $(e.target);
		} else {
			var $elemBlock = $($('.Block')[index]);
		}
		$elemBlock.removeClass();
		$elemBlock.addClass("Block qBlock");
		for(var i = 0; i < 4; i++) {
			(function(num) {
				setTimeout(function() {
					$elemBlock.removeClass();
					$elemBlock.addClass("Block qBlock-active");
				}, num * 200);
				setTimeout(function() {
					$elemBlock.removeClass();
					$elemBlock.addClass("Block qBlock");
				}, num * 300);
			})(i);
		};
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				if(map[i][j] == -1) {
					this._boomMines(i, j);
				}
			}
		}
		$('.fBlock').removeClass().addClass("misBlock Block");
		$('.Block').off("click");
		$('.Block').off("mouseup");
		$('.Block').off("mousedown");
		$('.sBlock').off("mouseup");
		clearTimeout(this.$clock);
		/*var $index = $('.Block').index($(e.target));
		var numX = Math.floor($index / 18);
		var numY = $index % 18;*/
	},
	_boomMines: function _boomMines(x, y) {
		var $index = x * 18 + y;
		var $elemBlock = $($('.Block')[$index]);
		if($elemBlock.hasClass("fBlock")) {
			$elemBlock.removeClass();
			$elemBlock.addClass("Block rBlock");
			return;
		}
		$elemBlock.removeClass();
		$elemBlock.addClass("Block qBlock");
		(function(index) {
			setTimeout(function() {
				$elemBlock.removeClass();
				$elemBlock.addClass("Block qBlock-active");
			}, 10 * index);
		})($index);
	},
	//点击空白区,0值
	_clickEmpty: function _clickEmpty(e, x, y) {
		if(e == null && (x == null || y == null)) return;
		if(e != null) {
			var $index = $('.Block').index($(e.target));
			var numX = Math.floor($index / 18);
			var numY = $index % 18;
		} else {
			var numX = x;
			var numY = y;
		}
		//寻找0值域
		this._linkEmpty(numX, numY);
		this._setEmptyMap();
	},
	//点击雷域区
	_clickMinesArray: function _clickMinesArray(e, x, y) {
		if(e == null && (x == null || y == null)) return;
		if(e != null) {
			var $index = $('.Block').index($(e.target));
			var numX = Math.floor($index / 18);
			var numY = $index % 18;
			var $elemBlock = $(e.target);
		} else {
			var $index = x * 18 + y;
			var numX = x;
			var numY = y;
			var $elemBlock = $($('.Block')[$index]);
		}
		var $textspan = $("<span></span>");
		$elemBlock.removeClass();
		$elemBlock.addClass("Block enBlock");
		$textspan.text(map[numX][numY]);
		//console.log($elemBlock);
		if($elemBlock[0].children.length == 0) {
			if(map[numX][numY] == 1) $textspan.css("color", "#2E6DA4");
			else if(map[numX][numY] == 2) $textspan.css("color", "#5CB85C");
			else if(map[numX][numY] == 3) $textspan.css("color", "#C9302C");
			else if(map[numX][numY] == 4) $textspan.css("color", "#D58512");
			else $textspan.css("color", "#EEA236");
			$elemBlock.append($textspan);
		};

	},
	//右键插旗
	_setFlag: function _setFlag(e) {
		var $index = $('.Block').index($(e.target));
		var numX = Math.floor($index / 18);
		var numY = $index % 18;
		if($(e.target).hasClass("fBlock")) {
			$(e.target).removeClass("fBlock");
			$(e.target).addClass('sBlock');
			flagMap[numX][numY] = 0;
			this.$overNum++;
			$('.Mines-body').text(this.$overNum);
		} else {
			$(e.target).removeClass("sBlock");
			$(e.target).addClass("fBlock");
			flagMap[numX][numY] = 1;
			this.$overNum--;
			$('.Mines-body').text(this.$overNum);
			if(this.$overNum == 0 && this._checkVictor()) {
				alert("You win!");
			}
		}
		var _this = this;
		$('.fBlock').off("mouseup").on("mouseup", function(e) {
			if(e.which === 3) {
				if($(e.target).hasClass("sBlock")) {
					$(e.target).removeClass().addClass("Block fBlock");
					_this.$overNum--;
					$('.Mines-body').text(_this.$overNum);
					if(this.$overNum == 0 && this._checkVictor()) {
						alert("You win!");
					}
					return;
				}
				if($(e.target).hasClass("fBlock")) {
					$(e.target).removeClass().addClass("Block sBlock");
					_this.$overNum++;
					$('.Mines-body').text(_this.$overNum);
					return;
				}
			}
		});
	},
	_checkVictor: function _checkVictor() {
		var $num = this.$num;
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {
				if(map[i][j] == -1) {
					var $index = i * 18 + j;
					if(!$($('.Block')[$index]).hasClass("fBlock")) {
						return false;
					}
				}
			}
		}
		$('.fBlock').removeClass().addClass("misBlock Block");
		$('.Block').off("click");
		$('.Block').off("mouseup");
		$('.Block').off("mousedown");
		$('.sBlock').off("mouseup");
		clearTimeout(this.$clock);
		return true;
	},
	_bindEvent: function _bindEvent() {
		var _this = this;
		$('.Block').on("mousedown", function(e) {
			//重设标志
			_this.$checkFlag = false;
			//阻止默认
			$(e.target).bind("contextmenu", function() {
				return false;
			});
			//二次点击判定
			if(_this.$firstClick != null) {
				_this.$secondClick = e.which;
				if(_this.$secondClick === _this.$firstClick) {
					_this.$secondClick = null;
					_this.$firstClick = null;
					return;
				} else {
					_this.$checkFlag = true;
					//点击是文字
					if(e.target.nodeName === "SPAN") {
						var $spanValue = $(e.target).text();
						e.target = e.target.parentNode;
					}
					//不接受空白块
					if($(e.target).hasClass("eBlock")) return;
					//得到位置
					var $index = $('.Block').index($(e.target));
					var $clickX = Math.floor($index / 18);
					var $clickY = $index % 18;
					var $indexItem;
					var $indexItemCtn = [];
					var $flagAns = 0;
					var setColor = function(index) {
						if($($('.Block')[index]).hasClass("eBlock") || $($('.Block')[index]).hasClass("enBlock")) return;
						if($($('.Block')[index]).hasClass("fBlock")) {
							$flagAns++;
							return;
						}
						$indexItemCtn.push(index);
						$($('.Block')[index]).addClass("Block-judge");
					}
					//边界鉴定
					setColor($index);
					if($clickX != 0) {
						$indexItem = ($clickX - 1) * 18 + $clickY;
						setColor($indexItem);
					}
					if($clickY != 0) {
						$indexItem = $clickX * 18 + $clickY - 1;
						setColor($indexItem);
					}
					if($clickX != 17) {
						$indexItem = ($clickX + 1) * 18 + $clickY;
						setColor($indexItem);
					}
					if($clickY != 17) {
						$indexItem = $clickX * 18 + $clickY + 1;
						setColor($indexItem);
					}
					if($clickY != 0 && $clickX != 0) {
						$indexItem = ($clickX - 1) * 18 + $clickY - 1;
						setColor($indexItem);
					}
					if($clickY != 17 && $clickX != 0) {
						$indexItem = ($clickX - 1) * 18 + $clickY + 1;
						setColor($indexItem);
					}
					if($clickY != 17 && $clickX != 17) {
						$indexItem = ($clickX + 1) * 18 + $clickY + 1;
						setColor($indexItem);
					}
					if($clickY != 0 && $clickX != 17) {
						$indexItem = ($clickX + 1) * 18 + $clickY - 1;
						setColor($indexItem);
					}
					//数值鉴定
					$indexItemCtn.forEach(function(item, index) {
						//只接受带值块
						if($flagAns != $spanValue) return;
						if(!$(e.target).hasClass("enBlock")) return;
						if($spanValue == null) return;

						var $checkX = Math.floor(item / 18);
						var $checkY = item % 18;
						//展开
						if(map[$checkX][$checkY] == -1) {
							//雷
							_this._clickMines(null, item);
						} else if(map[$checkX][$checkY] == 0) {
							//空白区
							_this._clickEmpty(null, $checkX, $checkY);
						} else {
							//雷域
							_this._clickMinesArray(null, $checkX, $checkY);
						}
					});
				}
			} else {
				_this.$firstClick = e.which;
			}
		});
		$('.sBlock').on("mouseup", function(e) {
			//阻止默认事件
			//e.preventDefault();
			if(_this.$checkFlag) {
				_this.$firstClick = null;
				_this.$secondClick = null;
				$('.Block').removeClass("Block-judge");
				return;
			}
			_this.$firstClick = null;
			_this.$secondClick = null;
			$(e.target).bind("contextmenu", function() {
				return false;
			});
			//不接受非sBlock
			if(!$(e.target).hasClass("sBlock")) return;
			var $firstFlag = _this.$firstFlag;
			if(e.which === 3 && $firstFlag) {
				//右键
				_this._setFlag(e);
				return;
			}
			//得到坐标
			var $index = $('.Block').index($(e.target));
			var $clickX = Math.floor($index / 18);
			var $clickY = $index % 18;
			if(!$firstFlag) _this._clickStart(e);
			else {
				if(map[$clickX][$clickY] == -1) {
					//雷
					_this._clickMines(e);
				} else if(map[$clickX][$clickY] == 0) {
					//空白区
					_this._clickEmpty(e);
				} else {
					//雷域
					_this._clickMinesArray(e);
				}
			}
		});

	},
	_reClassedBlock: function _reClassedBlock() {
		var $num = this.$num;
		for(var i = 0; i < $num; i++) {
			for(var j = 0; j < $num; j++) {}
		}
	},

	_start: function _start() {
		this._initBlock();
		this._bindEvent();
	}
}

window.Game = Minesweeper;