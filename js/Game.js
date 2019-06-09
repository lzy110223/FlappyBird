function Game(ctx, bird, pipe, land, mountain) {
    this.ctx = ctx;
    this.bird = bird;
    this.land = land;
    this.mountain = mountain;
    this.pipeArr = [pipe];
    this.timer = null;
    this.iframe = null;
    this.init();

}
Game.prototype.init = function () {
    this.start();
    this.bindEvent();
}
// 渲染山
Game.prototype.renderMountain = function () {
    this.mountain.x -= this.mountain.step;
    if (this.mountain.x < -this.mountain.img.width) {
        this.mountain.x = 0;
    }

    this.ctx.drawImage(this.mountain.img, this.mountain.x, this.mountain.y);
    this.ctx.drawImage(this.mountain.img, this.mountain.x + this.mountain.img.width, this.mountain.y);
    this.ctx.drawImage(this.mountain.img, this.mountain.x + this.mountain.img.width * 2, this.mountain.y)
}
// 渲染地平面
Game.prototype.renderland = function () {
    this.land.x -= this.land.step;
    if (this.land.x < -this.land.img.width) {
        this.land.x = 0;
    }

    this.ctx.drawImage(this.land.img, this.land.x, this.land.y);
    this.ctx.drawImage(this.land.img, this.land.x + this.land.img.width, this.land.y);
    this.ctx.drawImage(this.land.img, this.land.x + this.land.img.width * 2, this.land.y)
}
// 渲染鸟
Game.prototype.renderBird = function () {
    this.ctx.save();
    // 平移坐标系
    this.ctx.translate(this.bird.x, this.bird.y);
    var deg = this.bird.state === "D" ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
    this.ctx.rotate(deg)
    this.ctx.drawImage(this.bird.img, -this.bird.img.width / 2, -this.bird.img.height / 2);
    this.ctx.restore();
}
// 初始化游戏
Game.prototype.start = function () {
    // 确保下面的this指向

    var me = this;

    this.timer = setInterval(function () {
        me.iframe++;
        me.clear();
        me.checkPX();
        me.checkPX1();
        me.renderMountain();
        me.renderland();
        me.renderBird();
        // 鸟飞
        if (!(me.iframe % 10)) {
            me.bird.fly()
        }
        // 鸟下降
        me.bird.down();
        me.movePipe();
        me.renderPipe();
        if(!(me.iframe % 65)){
            me.creatPipe();
        }
        me.clearArr();
    }, 20)
}
// 清屏
Game.prototype.clear = function () {
    this.ctx.clearRect(0, 0, 360, 512)
}

// 点击事件
Game.prototype.bindEvent = function () {
    // 确保下面的this指向
    var me = this;
    this.ctx.canvas.onclick = function () {
        // 鸟上升
        me.bird.up();
    }
    document.onkeydown = function (e) {
        // 鸟上升
        if (e.keyCode === 38) {
            me.bird.up();
        }

    }
}

// 渲染管子
Game.prototype.renderPipe = function () {
    var me = this;
    this.pipeArr.forEach(function (value) {
        var img = value.pipe_up;
        var img_x = 0;
        var img_y = img.height - value.up_height;
        var img_w = img.width;
        var img_h = value.up_height;
        var canvas_x = me.ctx.canvas.width - value.step * value.count;
        var canvas_y = 0;
        var canvas_w = img.width;
        var canvas_h = value.up_height;
        me.ctx.drawImage(img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h)

        var img_down = value.pipe_down;
        var img_down_x = 0;
        var img_down_y = 0;
        var img_down_w = img_down.width;
        var img_down_h = value.down_height;
        var canvas_down_x = me.ctx.canvas.width - value.step * value.count;
        var canvas_down_y = value.up_height + 150;
        var canvas_down_w = img_down.width;
        var canvas_down_h = value.down_height;
        me.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, canvas_down_x, canvas_down_y, canvas_down_w, canvas_down_h)
    })
}

// 管子的移动
Game.prototype.movePipe = function(){
    this.pipeArr.forEach(function(value){
        value.count++;
    })
}

Game.prototype.creatPipe = function(){
   var pipe = this.pipeArr[0].creatPipe();

   this.pipeArr.push(pipe)
}

Game.prototype.clearArr = function(){
    // 移除管子
    for(var i = 0;i<this.pipeArr.length;i++){
        var pipe = this.pipeArr[i];
        if(pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width){
            this.pipeArr.splice(i,1);
            return
        }
    }
}

Game.prototype.Gameover = function(){
    clearInterval(this.timer)
}

Game.prototype.checkPX = function() {
	// 清屏
	this.ctx.clearRect(0, 0, 360, 512);
	// 保存状态
	this.ctx.save();
	// 渲染
	this.renderPipe();
	// 改变融合方式
	this.ctx.globalCompositeOperation = "source-in";
	// 渲染鸟
	this.renderBird();
	// 恢复状态
	this.ctx.restore();

	// 获取像素信息
	var imgData = this.ctx.getImageData(0, 0, 360, 512);
	for (var i = 0; i < imgData.data.length; i++) {
		if (imgData.data[i]) {
			console.log("撞到了");
			this.Gameover();
			return;
		}
	}
}

Game.prototype.checkPX1 = function() {
	// 清屏
	this.ctx.clearRect(0, 0, 360, 512);
	// 保存状态
	this.ctx.save();
	// 渲染
	this.renderland();
	// 改变融合方式
	this.ctx.globalCompositeOperation = "source-in";
	// 渲染鸟
	this.renderBird();
	// 恢复状态
	this.ctx.restore();

	// 获取像素信息
	var imgData = this.ctx.getImageData(0, 0, 360, 512);
	for (var i = 0; i < imgData.data.length; i++) {
		if (imgData.data[i]) {
			console.log("撞到了");
			this.Gameover();
			return;
		}
	}
}