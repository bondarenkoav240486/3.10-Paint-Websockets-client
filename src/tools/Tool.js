
export default class Tool {
    constructor(canvas,strokeStyle, socket, id) {

        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
        
        // this.canvas = canvas
        this.strokeStyle = strokeStyle
        // this.ctx = canvas.getContext('2d')
        // this.destroyEvents()
        // this.ctx.strokeStyle = strokeStyle.value
        this.ctx.strokeStyle = strokeStyle

        // this.socket = socket
        // this.id = id
        this.ctx.fillStyle ='#EB4C42';
    }
    set fillColor(color) {
        this.ctx.fillStyle = color;
    }
    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }
    set lineWidth(width) {
        this.ctx.lineWidth = width;
    }
    destroyEvents() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}
