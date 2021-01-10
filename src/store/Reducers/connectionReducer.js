export const connState = {
    state: [],
    loading: true,
    error: false
}

export const connReducer = (state = connState, action) => {
    switch (action.type) {
        case 'ADD_CONNECTIONS':
            return { state: action.payload, loading: false, error: false }
        case 'LOADING_CONNECTIONS':
            return { ...state, loading: true }
        default:
            return { ...state, loading: false, error: true }
    }
}