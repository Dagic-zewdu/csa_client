export const messageState = {
    state: [],
    loading: true,
    error: false
}

export const messageReducer = (state = messageState, action) => {
    switch (action.type) {
        case 'ADD_MESSAGES':
            return { state: action.payload, loading: false, error: false }
        case 'LOADING_MESSAGES':
            return { ...state, loading: true }
        default:
            return { ...state, loading: false, error: true }
    }
}