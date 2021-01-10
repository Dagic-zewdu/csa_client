
export const addConn = (connections) => {
    return {
        type: 'ADD_CONNECTIONS', payload: connections
    }
}
export const loadingConn = () => {
    return {
        type: 'LOADING_CONNECTIONS'
    }
}