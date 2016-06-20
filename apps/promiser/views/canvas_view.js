Promiser.CanvasView = SC.View.extend({
    classNames: ['canvas-view'],
    
    render: function (context, firstTime) {
        if (firstTime) {
            context.push('<canvas style="background:#666;"></canvas>');
        }
    },
    
    didCreateLayer: function () {
        var me = this;
        this.canvas = this.$('canvas')[0];
        this.engine = Promiser.engine;
        Promiser.camera = this.camera = Promiser.Camera.create({
            x: this.engine.width / 2,
            y: this.engine.height / 2,
            zoom: 0.5
        });
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.worker = setInterval(this.triggerPaint.bind(this), this.engine.msStep);
    },
    
    didUpdateLayer: function () {
        // no-op;
    },

    paint: function (timestamp) {
        this.ctx.strokeStyle = "#DDDD55";
        this.ctx.lineWidth = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        var s = this.engine.props.length;
        var zoom = this.camera.get('zoom');
        var cx = this.camera.get('x');
        var cy = this.camera.get('y');

        var tail = 2.5;
        
        this.ctx.beginPath();

        for (var i=0; i<this.engine.count; i++) {
            var x = this.engine.floatBuffer[i*s+0];
            var y = this.engine.floatBuffer[i*s+1];
            var vx = this.engine.floatBuffer[i*s+2];
            var vy = this.engine.floatBuffer[i*s+3];
            var target = this.engine.intBuffer[i*s+4];
            var isStatic = this.engine.intBuffer[i*s+5];
            var dSq = vx*vx+vy*vy;

            // camera transformation
            x = zoom * (x - cx) + this.canvas.width / 2;
            y = zoom * (y - cy) + this.canvas.height / 2;
            vx = vx * zoom;
            vy = vy * zoom;

            if (dSq > 0.000000000001 ) {
                var d = Math.sqrt(dSq);
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x - vx * tail, y - vy * tail);
            } else {
                this.ctx.moveTo(x-0.01, y-0.01);
                this.ctx.lineTo(x+0.01, y+0.01);
            }
            
        }

        this.ctx.stroke();
    },

    triggerPaint: function () {
        window.requestAnimationFrame(this.paint.bind(this));
    },

    resizeCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
});
