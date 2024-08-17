import {makeAutoObservable} from "mobx";

class StrokeStyleState {
    strokeStyle = null
    constructor() {
        makeAutoObservable(this)
        this.strokeStyle='#318CE7'
    }
    setStrokeStyle(strokeStyle) {
        this.strokeStyle = strokeStyle
    }
}

export default new StrokeStyleState()
