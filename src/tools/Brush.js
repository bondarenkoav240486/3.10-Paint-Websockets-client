import Tool from "./Tool";
import strokeStyleState from "../store/strokeStyleState";

export default class Brush extends Tool {
    constructor(canvas, fillStyle, socket, id) {
        super(canvas, fillStyle, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.ontouchmove = this.touchMoveHandler.bind(this);
        this.canvas.ontouchstart = this.touchStartHandler.bind(this);
        this.canvas.ontouchend = this.touchEndHandler.bind(this);
    }

    mouseUpHandler() {
        this.mouseDown = false;
        this.finishDrawing();
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(
            e.pageX - e.target.offsetLeft,
            e.pageY - e.target.offsetTop
        );
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    // strokeColor: this.ctx.strokeStyle,
                    strokeColor: strokeStyleState.strokeStyle,
                    // this.strokeStyle
                    fillColor: this.ctx.fillStyle,
                }
            }));
        }
    }

    touchStartHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(
            e.targetTouches[0].pageX - e.target.offsetLeft,
            e.targetTouches[0].pageY - e.target.offsetTop
        );
        e.preventDefault(); // Prevent default scrolling behavior
    }

    touchMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.targetTouches[0].pageX - e.target.offsetLeft,
                    y: e.targetTouches[0].pageY - e.target.offsetTop
                }
            }));
            e.preventDefault(); // Prevent default scrolling behavior
        }
    }

    touchEndHandler() {
        this.mouseDown = false;
        this.finishDrawing();
    }

    finishDrawing() {
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }));
    }

    static draw(ctx, x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}
