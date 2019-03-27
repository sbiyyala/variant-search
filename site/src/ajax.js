function ajax(url, options = {}) {
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    });
}

export {ajax};