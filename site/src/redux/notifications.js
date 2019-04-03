const INIT_STATE = {
    unhandled: {
        error: null
    }
};

const DISPLAY_UNHANDLED_ERROR = 'DISPLAY_UNHANDLED_ERROR';

export const displayUnhandledError = error => ({type: DISPLAY_UNHANDLED_ERROR, error});

export const notifications = (state = INIT_STATE, action) => {
    if (action.type === DISPLAY_UNHANDLED_ERROR) {
        return {
            ...state,
            unhandled: {
                error: action.error
            }
        };
    } else {
        return state;
    }
};


