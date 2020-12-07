export const UserState = {
    state: [],
    loading: true,
    error: false
}

export const UserReducer = (state = UserState, action) => {
    switch (action.type) {
        case 'ADD_USERS':
            return { state: action.payload, loading: false, error: false }
        case 'LOADING_USERS':
            return { ...state, loading: true }
        default:
            return { ...state, loading: false, error: true }
    }
}