import Tool from "./Tool";
import strokeStyleState from "../store/strokeStyleState";
import toolState from "../store/toolState";

export default class Circle extends Tool {
    // constructor(canvas,fillStyle) {
    //     super(canvas,fillStyle);
    //     this.listen();
    // }
    constructor(canvas, fillStyle, socket, id) {
        super(canvas, fillStyle, socket, id);
        this.listen();
    }
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.ontouchmove = this.mouseMoveHandler.bind(this);
        this.canvas.ontouchstart = this.mouseDownHandler.bind(this);
        this.canvas.ontouchend = this.mouseUpHandler.bind(this);
    }
    mouseDownHandler(e) {
        this.mouseDown = true;
        let canvasData = this.canvas.toDataURL();
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        if (e.targetTouches) {
            this.startX = e.targetTouches[0].pageX - e.target.offsetLeft;
            this.startY = e.targetTouches[0].pageY - e.target.offsetTop;
        }
        this.saved = canvasData;
    }
    mouseUpHandler(e) {
        this.mouseDown = false
        // Відправка даних про коло через WebSocket
        if (this.socket && this.id) {
            const figure = {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                radius: this.radius,
                // color: this.ctx.fillStyle,
                strokeColor: strokeStyleState.strokeStyle,
                fillColor: toolState.fillColor,
            };

            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: figure
            }));

        }
        this.finishDrawing();

    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let curentX = e.pageX - e.target.offsetLeft;
            let curentY = e.pageY - e.target.offsetTop;
            if (e.targetTouches) {
                curentX = e.targetTouches[0].pageX - e.target.offsetLeft;
                curentY = e.targetTouches[0].pageY - e.target.offsetTop;
            }
            let width = curentX - this.startX;
            let height = curentY - this.startY;
            // let r = Math.sqrt(width ** 2 + height ** 2);
            // this.draw(this.startX, this.startY, r);
            // e.preventDefault();

            // Calculate the radius and store it in the class
            this.radius = Math.sqrt(width ** 2 + height ** 2);
            this.draw(this.startX, this.startY, this.radius);
            e.preventDefault();
        }
    }
    draw(x, y, r) {
        const img = new Image();
        img.src = this.saved;
        img.onload = async function () {
            this.ctx.clearRect(
                0, 0, this.canvas.width, this.canvas.height
            );
            this.ctx.drawImage(
                img, 0, 0, this.canvas.width, this.canvas.height
            );
            this.ctx.fillStyle = toolState.fillColor;
            this.ctx.strokeStyle = strokeStyleState.strokeStyle;
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }.bind(this)
    }

    static staticDraw(ctx, x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
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
}
