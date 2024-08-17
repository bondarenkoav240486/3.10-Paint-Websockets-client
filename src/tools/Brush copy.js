import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas, fillStyle, socket, id) {
        super(canvas, fillStyle, socket, id);
        this.listen()
    }
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.ontouchmove = this.mouseMoveHandler.bind(this);
        this.canvas.ontouchstart = this.mouseDownHandler.bind(this);
        this.canvas.ontouchend = this.mouseUpHandler.bind(this);
    }
    mouseUpHandler(e) {
        // this.mouseDown = false
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        if (e.targetTouches) {
            this.ctx.moveTo(
                e.targetTouches[0].pageX - e.target.offsetLeft,
                e.targetTouches[0].pageY - e.target.offsetTop
            )
        }
        this.ctx.moveTo(
            e.pageX - e.target.offsetLeft,
            e.pageY - e.target.offsetTop
        )
    }
    mouseMoveHandler(e) {
        // if (this.mouseDown) {
        //     if(e.targetTouches){
        //         this.draw(
        //             e.targetTouches[0].pageX - e.target.offsetLeft,
        //             e.targetTouches[0].pageY - e.target.offsetTop)
        //     }
        //     this.draw(
        //         e.pageX - e.target.offsetLeft, 
        //         e.pageY - e.target.offsetTop
        //     );
        //     e.preventDefault();
        // }
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop
                }
            }))
        }
    }
    // draw(x, y) {
    //     this.ctx.lineTo(x, y)
    //     this.ctx.stroke()
    // }
    static draw(ctx, x, y) {
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
