import {makeAutoObservable} from "mobx";

class ToolState {
    tool = null
    fillStyle=null
    lineWidth = 1;
    fillColor = '#EB4C42'
    // fillColor = '#50C878'
    // #50C878
    constructor() {
        makeAutoObservable(this)
    }
    setTool(tool,fillStyle) {
        this.tool = tool
    }
    setFillColor(color) {
        this.fillColor  = color;
        this.tool.fillColor = color
    }
    setStrokeColor(color) {
        this.tool.strokeColor = color
    }
    setLineWidth(width) {
        this.lineWidth = width;

        if( this.tool){
            this.tool.lineWidth = width
        }
    }
}

export default new ToolState()
