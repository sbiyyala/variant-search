import React from "react";
import {chunkString} from "../utils";

const ValueRenderer = ({data: {value}}) => {
    const chunks = chunkString(value, 100);
    return (
        <div className="d-flex flex-column">
            {chunks.map((chunk, idx) => <span key={idx}>{chunk}</span>)}
        </div>);
};

export default ValueRenderer;