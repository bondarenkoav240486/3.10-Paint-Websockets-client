
import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import strokeStyleState from "../store/strokeStyleState";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { useParams } from "react-router-dom"
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";

import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

import axios from 'axios'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Canvas = observer(() => {

    const baseURL = process.env.REACT_APP_URL || 'http://localhost:5000';


    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const usernameRef = useRef()

    const params = useParams()


    const canvasRef = useRef()
    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        // axios.get(`http://localhost:5000/image?id=${params.id}`)
        // axios.get(`${process.env.URL}/image?id=${params.id}`)
        axios.get(`${baseURL}/image?id=${params.id}`)

            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            }).catch(error => {
                console.log('Error loading image:', error.message);
            });
    }, [])


    useEffect(() => {
        if (canvasState.username) {
            // const socket = new WebSocket(`ws://localhost:5000/`);
            // const socket = new WebSocket(`ws://${process.env.ADRESSFORSOKET}/`);
            const socket = new WebSocket(`ws://${process.env.REACT_APP_ADRESSFORSOKET}/`);

            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, strokeStyleState.strokeStyle, socket, params.id))
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                // debugger
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                    case "pushToUndo":
                        // canvasState.pushToUndo(msg.dataUrl);
                        canvasState.pushToUndo(
                            canvasRef.current.toDataURL()
                        );
                        break;
                    case "undo":
                        canvasState.undo();
                        break;
                    case "redo":
                        canvasState.redo();
                        break;
                    case "setLineWidth":
                        toolState.setLineWidth(msg.lineWidth); // Оновлюємо стан при отриманні повідомлення
                        break;
                    case "changeColorFIllStyle":
                        toolState.setFillColor(msg.fillColor)
                        break;
                }
            }
        }
    }, [canvasState.username])


    const mouseDownHandler = () => {
        // canvasState.pushToUndo(canvasRef.current.toDataURL())
        // canvasState.pushToUndo(canvasRef.current.toDataURL())
        // axios.post(`http://localhost:5000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
        // .then(response => console.log(response.data))
        canvasState.socket.send(JSON.stringify({
            method: "pushToUndo",
            id: canvasState.sessionid,
            // dataUrl: canvasRef.current.toDataURL()
        }));
    }

    const mouseUpHandler = () => {
        // axios.post(`http://localhost:5000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
        axios.post(`${baseURL}/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
       
        .then(response => console.log(response.data))

        // Broadcast the undo action to all users in the session
        // canvasState.socket.send(JSON.stringify({
        //     method: "pushToUndo",
        //     id: canvasState.sessionid,
        //     dataUrl: canvasRef.current.toDataURL()
        // }));
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        // setModal(false)
        setOpen(false)
    }

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        // ctx.strokeStyle = '#A7FF64'
        ctx.strokeStyle = figure.strokeColor;
        ctx.fillStyle =figure.fillColor;
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case "rect":
                // Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor);
                break
            case "circle":
                // Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.color);
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.fillColor);
                break;
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y);
                break;
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.color);
                break;
            case "finish":
                ctx.beginPath()
                break
        }
    }



    return (
        <div className="canvas">
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
           
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Введіть ваше ім'я
                    </Typography>
                    <Typography
                        id="modal-modal-description" sx={{ mt: 2 }}
                        onClick={() => connectHandler()}
                    >
                    </Typography>
                    <input type="text" ref={usernameRef} />
                    <Button onClick={connectHandler}>Enter</Button>
                </Box>
            </Modal>
            <canvas
                width={300}
                height={400}
                ref={canvasRef}
                onMouseDown={() => mouseDownHandler()}
                onMouseUp={() => mouseUpHandler()}
                onTouchStart={() => mouseDownHandler()}
                onTouchEnd={() => mouseUpHandler()}
            >
            </canvas>
        </div>
    );
})

export default Canvas;
