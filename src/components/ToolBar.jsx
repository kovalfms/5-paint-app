import React from 'react';
import '../styles/toolbar.scss'

const ToolBar = (
    {
        clear,
        brash,
        size,
        updateSize,
        erase,
        download,
        lineCap,
        updateLineCap,
        color,
        updateColor,
        random,
        setToRectangle,
        copy,
        move,
        cut
    }) => {

    return (
        <div className="toolbar">
            <div>
                <span className="toolbar__size">{size}</span>
                <input
                    className="toolbar__range"
                    type="range"
                    value={size}
                    min={1}
                    max={40}
                    onChange={updateSize}
                />
            </div>

            <div className="toolbar__radioForm">
                <label className="toolbar__label">
                    <input
                        type="radio"
                        id="round"
                        value="round"
                        onChange={updateLineCap}
                        checked={lineCap === "round"}
                    />
                    <span>Round</span>
                </label>
                <label className="toolbar__label">
                    <input
                        type="radio"
                        value="butt"
                        onChange={updateLineCap}
                        checked={lineCap === "butt"}
                    />
                    <span>Butt</span>
                </label>
                <label className="toolbar__label">
                    <input
                        type="radio"
                        value="square"
                        onChange={updateLineCap}
                        checked={lineCap === "square"}
                    />
                    <span>Square</span>
                </label>
            </div>
            <div className="toolbar__color">
                <input
                    title="Color"
                    type="color"
                    value={color}
                    onChange={updateColor}
                />
            </div>
            <button title="brash" className="toolbar__btn brush" onClick={brash}></button>
            <button title="Random color" className="toolbar__btn switch" onClick={random}></button>
            <button title="Erase" className="toolbar__btn eraser" onClick={erase}></button>
            <button title="Crop" className="toolbar__btn crop" onClick={cut}></button>
            <button title="Copy" className="toolbar__btn copy" onClick={setToRectangle}></button>
            {copy && <button title="Paste" className="toolbar__btn insert" onClick={move}></button>}
            <button title="Clear canvas" className="toolbar__btn clear" onClick={clear}></button>
            <a onClick={download} href="/download">
                <button title="Download" className="toolbar__btn download"></button>
            </a>
        </div>
    );
};

export default ToolBar;