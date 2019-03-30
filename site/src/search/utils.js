function chunkString(input, limit) {
    if (!input) {
        return [];
    } else if (Array.isArray(input)) {
        return input;
    } else {
        const _size = Math.ceil(input.length / limit),
            _ret = new Array(_size);
        let _offset;

        for (var _i = 0; _i < _size; _i++) {
            _offset = _i * limit;
            _ret[_i] = input.substring(_offset, _offset + limit);
        }

        return _ret;
    }
}

export {chunkString};