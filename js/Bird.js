function Bird(imgArr, x, y) {
	// 图片数组
	this.imgArr = imgArr;
	// 定义图片的索引值
	this.index = parseInt(Math.random() * this.imgArr.length);
	// 精确一张图片
	this.img = this.imgArr[this.index];
	// 图片的x点
	this.x = x;
	// 图片的y点
	this.y = y;
	this.state = "D";
	this.speed = 0;
}

// 鸟的图片轮换
Bird.prototype.fly = function () {
	// 改版索引
	this.index++;
	if (this.index >= this.imgArr.length) {
		this.index = 0;
	}
	this.img = this.imgArr[this.index]
}

// 鸟下降
Bird.prototype.down = function () {
	if (this.state === "D") {
		this.speed++;
		this.y += Math.sqrt(this.speed)
	} else {
		this.speed--;
		if (this.speed == 0) {
			this.state = "D";
			return
		}
		this.y -= Math.sqrt(this.speed)
	}
}
// 鸟上升
Bird.prototype.up = function () {
	this.state = "U";
	this.speed = 20;
}