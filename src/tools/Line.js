import Tool from "./Tool";
import strokeStyleState from "../store/strokeStyleState";

export default class Line extends Tool {
    // constructor(canvas,strokeStyle) {
    //     super(canvas,strokeStyle);
    //     this.listen();
    //     this.name = 'Line';
    // }
    constructor(canvas, fillStyle, socket, id) {
        super(canvas, fillStyle, socket, id);
        this.listen();
    }
    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.ontouchmove = this.mouseMoveHandler.bind(this);
        this.canvas.ontouchstart = this.mouseDownHandler.bind(this);
        this.canvas.ontouchend = this.mouseUpHandler.bind(this);
    }
    mouseDownHandler(e) {
        this.mouseDown = true;
        // this.currentX = e.pageX - e.target.offsetLeft;
        // this.currentY = e.pageY - e.target.offsetTop;
        if (e.targetTouches) {
            this.currentX = e.targetTouches[0].pageX - e.target.offsetLeft;
            this.currentY = e.targetTouches[0].pageY - e.target.offsetTop;
        }
        else {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY);
        this.saved = this.canvas.toDataURL();
    }
    // mouseUpHandler(e) {
    //     this.mouseDown = false;

    //     // Send the line drawing data through WebSocket
    //     this.socket.send(JSON.stringify({
    //         method: 'draw',
    //         id: this.id,
    //         figure: {
    //             type: 'line',
    //             startX: this.currentX,
    //             startY: this.currentY,
    //             endX: e.pageX - e.target.offsetLeft,
    //             endY: e.pageY - e.target.offsetTop,
    //             color: strokeStyleState.strokeStyle.value,
    //         }
    //     }));
    // }

    mouseUpHandler(e) {
        this.mouseDown = false;

        let endX, endY;
        console.log(
            e,
            e.targetTouches
        )
        // changedTouches
        if (e.changedTouches && e.changedTouches[0]) {
            // if (e.targetTouches ) {
            this.endX = e.changedTouches[0].pageX - e.target.offsetLeft;
            this.endY = e.changedTouches[0].pageY - e.target.offsetTop;
        }else
        if (e.targetTouches && e.targetTouches[0]) {
            // if (e.targetTouches ) {
            this.endX = e.targetTouches[0].pageX - e.target.offsetLeft;
            this.endY = e.targetTouches[0].pageY - e.target.offsetTop;
        } else {
            this.endX = e.pageX - e.target.offsetLeft;
            this.endY = e.pageY - e.target.offsetTop;
        }


        // Send the line drawing data through WebSocket
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                startX: this.currentX,
                startY: this.currentY,
                endX: this.endX,
                endY: this.endY,
                // strokeColor: strokeStyleState.strokeStyle.value,
                strokeColor: strokeStyleState.strokeStyle,
            }
        }));

        //     // Закриваємо шлях
        //     // this.ctx.closePath();

        //     // Очищення координат
        //     // this.currentX = null;
        //     // this.currentY = null;
    }


    mouseMoveHandler(e) {
        if (this.mouseDown) {
            if (e.targetTouches) {
                this.draw(
                    e.targetTouches[0].pageX - e.target.offsetLeft,
                    e.targetTouches[0].pageY - e.target.offsetTop
                );
            }
            else {
                this.draw(
                    e.pageX - e.target.offsetLeft,
                    e.pageY - e.target.offsetTop
                );
            }
            e.preventDefault()
        }
    }
    draw(x, y) {
        const img = new Image();
        img.src = this.saved;
        img.onload = async function () {
            this.ctx.clearRect(
                0, 0, this.canvas.width, this.canvas.height
            );
            this.ctx.drawImage(
                img, 0, 0, this.canvas.width, this.canvas.height
            );
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentX, this.currentY);
            // this.ctx.strokeStyle = strokeStyleState.strokeStyle.value;
            this.ctx.strokeStyle = strokeStyleState.strokeStyle;
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }.bind(this);

    }

    static staticDraw(ctx, startX, startY, endX, endY) {
        // ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}
