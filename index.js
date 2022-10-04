/**
 * Snake Game
 * Snake game built using HTML5 canvas and Javascript
 * @author @mkcdr
 * @copyright 2022
 */

const game = {
    running: false,
    initialized: false,
    keypressed: false,
    updateInterval: null,
    width: 400,
    height: 400,
    cnv: null,  // game canvas
    ctx: null,  // canvas context
    gs: 20,     // grid size
    xtc: null,  // number of tiles at the X-axis
    ytc: null,  // number of tiles at the Y-axis
    score: 0,
    snake: {
        head: {x: 0, y: 0},     // head position
        vel: {x: 0, y: 0},      // snake's velocity
        tail: [],
        long: 1
    },
    apple: {x: 0, y: 0},
    init: function() {
        window.addEventListener("keydown", this.keypress.bind(this));
        this.cnv = document.getElementsByTagName("canvas")[0];
        this.ctx = this.cnv.getContext("2d");
        this.cnv.width = this.width;
        this.cnv.height = this.height;
        this.xtc = Math.floor(this.width/this.gs);
        this.ytc = Math.floor(this.height/this.gs);
        this.initialized = true;
    },
    reset: function() {
        this.score = 0;
        this.snake.vel = {x: 0, y: 0};
        this.snake.tail = [];
        this.snake.long = 1;
        this.snake.head.x = Math.floor(this.xtc/2);
        this.snake.head.y = Math.floor(this.ytc/2);
        this.updateSnake();
        this.updateApple();
    },
    updateSnake: function() {
        this.snake.tail.push({x: this.snake.head.x, y: this.snake.head.y});
    },
    updateApple: function() {
        this.apple.x = Math.floor(Math.random()*this.xtc);
        this.apple.y = Math.floor(Math.random()*this.ytc);
    },
    keypress: function(evt) {
        if (this.running && this.keypressed) return;
        this.keypressed=true;
        switch (evt.keyCode) {
            case 37:
                if (this.snake.vel.x != 1) {
                    this.snake.vel.x = -1;
                    this.snake.vel.y = 0;
                }
                break;
            case 38:
                if (this.snake.vel.y != 1) {
                    this.snake.vel.x = 0;
                    this.snake.vel.y = -1;
                }
                break;
            case 39:
                if (this.snake.vel.x != -1) {
                    this.snake.vel.x = 1;
                    this.snake.vel.y = 0;
                }
                break;
            case 40:
                if (this.snake.vel.y != -1) {
                    this.snake.vel.x = 0;
                    this.snake.vel.y = 1;
                }
                break;
            case 82:
                if (!this.running)
                    this.run();
                break;
        }
    },
    clear: function() {
        this.ctx.fillStyle= "black";
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    },
    draw: function() {
        // draw apple
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.apple.x*this.gs+2, this.apple.y*this.gs+2, this.gs-4, this.gs-4);

        // draw snake
        this.ctx.fillStyle = "lime";
        for (var i=0; i<this.snake.tail.length; ++i) {
            this.ctx.fillRect(this.snake.tail[i].x*this.gs+2, this.snake.tail[i].y*this.gs+2, this.gs-4, this.gs-4);
        }
        
        // draw score
        this.ctx.fillStyle = "#ddd";
        this.ctx.font = "20px monospace";
        this.ctx.fillText(this.score, this.cnv.width/2, 24);

        if (!this.running) {
            this.ctx.fillStyle= "#ddd";
            this.ctx.font = "bold 20px monospace";
            this.ctx.fillText("GAME OVER", this.cnv.width/2-50, this.cnv.height/2);
            this.ctx.fillStyle= "#ddd";
            this.ctx.font = "12px monospace";
            this.ctx.fillText("Click R to replay", this.cnv.width/2-57, this.cnv.height/2+20);
        }
    },
    update: function() {
        this.keypressed=false;
        this.snake.head.x += this.snake.vel.x;
        this.snake.head.y += this.snake.vel.y;

        if (this.snake.head.x > this.xtc-1) {
            this.snake.head.x = 0;
        } else if (this.snake.head.x < 0) {
            this.snake.head.x = this.xtc-1;
        }
        if (this.snake.head.y > this.ytc-1) {
            this.snake.head.y = 0;
        } else if (this.snake.head.y < 0) {
            this.snake.head.y = this.ytc-1;
        }

        for (var i=1; i<this.snake.tail.length; i++) {
            if (this.snake.head.x==this.snake.tail[i].x && this.snake.head.y==this.snake.tail[i].y) {
                window.clearInterval(this.updateInterval);
                this.running = false;
                break;
            }
        }

        this.updateSnake();
        if (this.snake.long<this.snake.tail.length) {
            this.snake.tail.shift();
        }

        if (this.snake.head.x==this.apple.x && this.snake.head.y==this.apple.y) {
            this.updateApple();
            this.snake.long++;
            this.score++;
        }

        this.clear();
        this.draw();
    },
    run: function() {
        this.running = true;
        if (!this.initialized) { 
            this.init(); 
        }
        this.reset();
        this.updateInterval = window.setInterval(this.update.bind(this), 1000/10);
    }
};

game.run();