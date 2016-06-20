Promiser.Engine = SC.Object.extend({

    init: function () {
        this.fuel();
    },

    fuel: function () {
        // initial setup
        this.speed = 0.25;
        this.speedSq = this.speed * this.speed;
        this.width = 1000;
        this.height = 1000;
        this.count = 10000;
        this.props = ['x', 'y', 'vx', 'vy', 'target', 'static', 'energy'];
        this.buffer = new ArrayBuffer(this.count * this.props.length * 4);
        this.floatBuffer = new Float32Array(this.buffer);
        this.intBuffer = new Int32Array(this.buffer);

        var s = this.props.length;

        for (var i=0; i<this.count; i++) {
            this.floatBuffer[i*s+0] = Math.random() * this.width;
            this.floatBuffer[i*s+1] = Math.random() * this.height;
            this.floatBuffer[i*s+2] = 0;
            this.floatBuffer[i*s+3] = 0;
            this.intBuffer[i*s+4] = this.getRandomTarget(i);
            this.intBuffer[i*s+5] = (Math.random() < 0.02 ? 1 : 0);
            this.intBuffer[i*s+6] = 6;
        }
    },

    ignite: function () {
        console.log('Ignite');
        this.worker = setInterval(this.update.bind(this), 1);
    },

    update: function () {
        var i;
        var s = this.props.length;

        for (i=0; i<this.count; i++) {
            var target = this.intBuffer[i*s+4];
            var static = this.intBuffer[i*s+5];
            var energy = this.intBuffer[i*s+6];
            var targetStatic = this.intBuffer[target*s+5];
            var targetEnergy = this.intBuffer[target*s+6];

            if (target === i || static) {
                continue;
            } 

            var x = this.floatBuffer[i*s+0];
            var y = this.floatBuffer[i*s+1];

            var targetX = this.floatBuffer[target*s+0];
            var targetY = this.floatBuffer[target*s+1];

            var dx = targetX - x;
            var dy = targetY - y;

            // if (dx >= this.width / 2) {
            //     dx -= this.width;
            // } else if (dx < -this.width /2) {
            //     dx += this.width;
            // }

            // if (dy >= this.height / 2) {
            //     dy -= this.height;
            // } else if (dy < -this.height /2) {
            //     dy += this.height;
            // }

            var dSq = dx*dx+dy*dy;
            
            if (dSq < 1 * this.speedSq) {
                if (energy > 0) {
                    this.intBuffer[i*s+4] = this.getRandomTarget(i);
                    this.intBuffer[i*s+6] = energy - 1;
                    if (energy - 1 == 0) {
                        static = 1;
                        this.intBuffer[i*s+5] = static;
                    } 
                }
                if (targetStatic) {
                    // revive
                    if (false && Math.random() < 0.001) {
                        this.intBuffer[target*s+5] = 1;
                        this.intBuffer[target*s+6] = 5;
                    }
                }
            } else {
                var d = Math.sqrt(dSq);
                var vx = dx / d * this.speed;
                var vy = dy / d * this.speed;
                this.floatBuffer[i*s+2] = vx;
                this.floatBuffer[i*s+3] = vy;
            }
        }

        for (i=0; i<this.count; i++) {
            var x = this.floatBuffer[i*s+0];
            var y = this.floatBuffer[i*s+1];
            var vx = this.floatBuffer[i*s+2];
            var vy = this.floatBuffer[i*s+3];
            var target = this.intBuffer[i*s+4];
            var static = this.intBuffer[i*s+5];
            var energy = this.intBuffer[i*s+6];

            x = x + vx;
            y = y + vy;

            // if (x < 0) {
            //     x += this.width;
            // } else if (x >= this.width) {
            //     x -= this.width;
            // }

            // if (y < 0) {
            //     y += this.height;
            // } else if (y >= this.height) {
            //     y -= this.height;
            // }

            if (!static) {
                this.floatBuffer[i*s+0] = x + vx;
                this.floatBuffer[i*s+1] = y + vy;    
            }
        }
    },

    getRandomTarget: function (i) {
        return (i + 1 + Math.floor(Math.random() * (this.count-1))) % this.count;
    }

});
