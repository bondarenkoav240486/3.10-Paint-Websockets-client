
import React, { useEffect, useRef, useState } from 'react';
import toolState from "../store/toolState";
import strokeStyleState from "../store/strokeStyleState";
import canvasState from "../store/canvasState";

import { observer } from "mobx-react-lite"; // Import observer here


const SettingBar = observer(
    () => {
    // const SettingBar = () => {
    const inputChangeColorStrokeRef = useRef();
    const inputChangeWidthCanvasRef = useRef();

    // useEffect(() => {
        // strokeStyleState.setStrokeStyle(inputChangeColorStrokeRef.current);
        // strokeStyleState.setStrokeStyle(inputChangeColorStrokeRef.current.value);
        // strokeStyleState.strokeStyle.value = '#318CE7'
    // }, [])

    const changeColorFIllStyle = e => {
        toolState.setFillColor(e.target.value)
        // if (canvasState.socket) {
        //     canvasState.socket.send(JSON.stringify({
        //         method: 'changeColorFIllStyle',
        //         id: canvasState.sessionid,
        //         fillColor: e.target.value
        //     }));
        // }
    }

    const changeColorStrokeStyle = e => {
        // toolState.setStrokeColor(e.target.value)
        strokeStyleState.setStrokeStyle(e.target.value);
        toolState.setStrokeColor(
            // strokeStyleState.setStrokeColor.value
            // strokeStyleState.strokeStyle.value
            strokeStyleState.strokeStyle
        )
    }
    const setLineWidthHandler = e => {
        // toolState.setLineWidth(e.target.value); // Оновлюємо стан при отриманні повідомлення
        // toolState.lineWidth = e.target.value
        if (canvasState.socket) {
            canvasState.socket.send(JSON.stringify({
                method: 'setLineWidth',
                id: canvasState.sessionid,
                lineWidth: e.target.value
            }));
        }
    }



    return (
        <div className="setting-bar">
            <div className="setting">
                <label htmlFor="line-width">товщина лінії</label>
                <input
                    // onChange={e => toolState.setLineWidth(e.target.value)}
                    onChange={e => setLineWidthHandler(e)}
                    style={{ margin: '0 10px' }}
                    id="line-width"
                    type="number"
                    defaultValue={1} 
                    min={1}
                    max={50}
                    value={toolState.lineWidth}  // Спостерігаємо за зміною значення
                    // strokeStyleState.

                />
            </div >
            <div className="setting">
                <label htmlFor="stroke-color">колір заливки</label>
                <input className="change-color-fill-style"
                    type="color"
                    id="fill-color"
                    onChange={e => changeColorFIllStyle(e)}
                    value={toolState.fillColor}
                />
            </div >
            <div className="setting">
                <label htmlFor="stroke-color">колір обведення</label>
                <input
                    className="change-color-stroke-style"
                    onChange={e => changeColorStrokeStyle(e)}
                    id="stroke-color"
                    type="color"
                    ref={inputChangeColorStrokeRef}
                    // value={toolState.fillColor}
                    value={strokeStyleState.strokeStyle}
                    

                />
            </div >
        </div>
    );
});

export default SettingBar;
