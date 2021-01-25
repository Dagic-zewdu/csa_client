export const addLetters = (letters) => {
    return {
        type: 'ADD_LETTERS', payload: letters
    }
}
export const loadingLetters = () => {
    return {
        type: 'LOADING_LETTERS'
    }
}