import Tool from "./Tool";
import Brush from "./Brush";
import strokeStyleState from "../store/strokeStyleState";

export default class Eraser extends Brush {
    // constructor(canvas,strokeStyle) {
    //     super(canvas,strokeStyle);
    // }
    constructor(canvas, fillStyle, socket, id) {
        super(canvas, fillStyle, socket, id);
        debugger
        // this.listen()
    }
    // draw(x, y) {
    //     this.ctx.strokeStyle = '#ffffff';
    //     this.ctx.lineTo(x, y);
    //     this.ctx.stroke();
    // }

     // Override the draw method to "erase" by drawing in white
     static draw(ctx, x, y) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // Use WebSocket to sync erasing actions with other users
            if (this.socket) {
                this.socket.send(JSON.stringify({
                    method: 'draw',
                    id: this.id,
                    figure: {
                        type: 'eraser', // Still using "brush" since the action is similar
                        x: e.pageX - e.target.offsetLeft,
                        y: e.pageY - e.target.offsetTop,
                        color: '#ffffff' // Erasing with white color
                    }
                }));
            }
        }
    }
}
