import React from "react";

const LinkRenderer = ({data: {url, source}}) => {
    if (!source) {
        return null;
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {source}
        </a>);
};

export default LinkRenderer;