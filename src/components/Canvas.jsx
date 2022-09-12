import React, {useEffect, useRef, useState} from 'react';
import ToolBar from "./ToolBar";

import "../styles/canvas.scss"


const Canvas = () => {
    const canvasRef = useRef(null)
    const [canvasCTX, setCanvasCTX] = useState(null)

    const [lineCap, setLineCap] = useState('round')
    const [coords, setCoords] = useState({x: 0, y: 0})
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(5)

    const [drawing, setDrawing] = useState(false)
    const [brash, setBrash] = useState(true)
    const [rectangle, setRectangle] = useState(false)
    const [drag, setDrag] = useState(false)
    const [crop, setCrop] = useState(false)

    const [imgData, setImgData] = useState()
    const [currentImg, setCurrentImg] = useState()
    const [copy, setCopy] = useState()
    const [cropImg, setCropImg] = useState()


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setCanvasCTX(ctx);

        const handleResize = () => {
            canvas.height = window.innerHeight
            canvas.width = window.innerWidth
        };

        handleResize();
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)

    }, [canvasRef]);


    const getRandomInt = (max) =>
        Math.floor(Math.random() * Math.floor(max))

    const getRandomColor = () => {
        setColor(
            `#${Array.from({length: 3}, () =>
                String(getRandomInt(255).toString(16)).padStart(2, '0')
            ).join('')}`
        )
    }

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent
        const ctx = canvasCTX
        const canvas = canvasRef.current;
        setCurrentImg(ctx.getImageData(0, 0, canvas.width, canvas.height))
        setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height))
        ctx.beginPath();
        setDrawing(true)
        setCoords({
            x: offsetX,
            y: offsetY
        })
    }

    const endDrawing = () => {
        const canvas = canvasRef.current
        if (rectangle) {
            canvasCTX.putImageData(currentImg, 0, 0)
        }
        if (crop) {
            canvasCTX.clearRect(0, 0, canvas.width, canvas.height)
            canvasCTX.putImageData(cropImg, coords.x, coords.y)
        }
        canvasCTX.closePath()
        setDrawing(false)
        setDrag(false)
    }

    const draw = ({nativeEvent}) => {
        if (!drawing) return
        const {offsetX, offsetY} = nativeEvent
        const canvas = canvasRef.current;
        const ctx = canvasCTX
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.putImageData(imgData, 0, 0);
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.lineCap = lineCap
        if (brash) {
            setRectangle(false)
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke()
        }
        if (rectangle) {
            setBrash(false)
            ctx.strokeStyle = "#4d4a4a"
            ctx.lineWidth = 1
            ctx.setLineDash([10, 4]);
            ctx.lineDashOffset = -1;
            ctx.strokeRect(coords.x, coords.y, offsetX - coords.x, offsetY - coords.y);
            if (offsetX > coords.x && offsetY > coords.y && !crop) {
                setCopy(ctx.getImageData(coords.x, coords.y, offsetX - coords.x, offsetY - coords.y))
            }
            if (offsetX > coords.x && offsetY > coords.y && crop) {
                setCropImg(ctx.getImageData(coords.x, coords.y, offsetX - coords.x, offsetY - coords.y))
            }
        }
        if (drag) {
            getCopyImage({nativeEvent})
        }
    }

    const getCopyImage = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent

        if (copy) {
            const img = new Image()
            img.src = copy
            setBrash(false)
            setRectangle(false)
            canvasCTX.drawImage(img, 0, 0)
            canvasCTX.putImageData(copy, offsetX - copy.width / 2, offsetY - copy.height / 2)
            setDrag(true)
        }
    }


    const updateColor = (e) => {
        setColor(e.target.value)
    }

    const updateLineCap = (e) => {
        setLineCap(e.target.value)
    }

    const updateSize = (e) => {
        setSize(e.target.value)
    }

    const setToBrash = () => {
        canvasCTX.globalCompositeOperation = 'source-over'
        setRectangle(false)
        setDrag(false)
        setBrash(true)
        setCrop(false)
    }

    const setToErase = () => {
        canvasCTX.globalCompositeOperation = 'destination-out'
        setRectangle(false)
        setDrag(false)
        setCrop(false)
    }

    const setToRectangle = () => {
        setRectangle(true)
        setBrash(false)
        setDrag(false)
        setCrop(false)
    }

    const setMove = () => {
        setRectangle(false)
        setBrash(false)
        setDrag(true)
        setCrop(false)
    }

    const setCut = () => {
        setCrop(true)
        setRectangle(true)
        setBrash(false)
        setDrag(false)
    }

    const clear = () => {
        canvasCTX.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
    }

    const downloadImage = (e) => {
        const link = e.currentTarget
        link.setAttribute('download', "picture.png")
        const picture = canvasRef.current.toDataURL('image/png')
        link.setAttribute('href', picture)
    }


    return (
        <div>
            <ToolBar
                brash={setToBrash}
                erase={setToErase}
                clear={clear}
                lineCap={lineCap}
                updateLineCap={updateLineCap}
                size={size}
                updateSize={updateSize}
                download={downloadImage}
                color={color}
                updateColor={updateColor}
                random={getRandomColor}
                setToRectangle={setToRectangle}
                getCopyImage={getCopyImage}
                copy={copy}
                drag={drag}
                move={setMove}
                cut={setCut}
            />
            <div className="canvas">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={() => setDrawing(false)}
                />
            </div>
        </div>

    );
};

export default Canvas;