
export const addMessages = (Messages) => {
    return {
        type: 'ADD_MESSAGES', payload: Messages
    }
}
export const loadingMessages = () => {
    return {
        type: 'LOADING_MESSAGES'
    }
}