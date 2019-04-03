function chunkString(input, limit = 10) {
    if (!input) {
        return [];
    } else if (Array.isArray(input)) {
        return input;
    } else {
        const _size = Math.ceil(input.length / limit),
            _ret = new Array(_size);
        let _offset;

        for (let idx = 0; idx < _size; idx++) {
            _offset = idx * limit;
            _ret[idx] = input.substring(_offset, _offset + limit);
        }

        return _ret;
    }
}

export {chunkString};