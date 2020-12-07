import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchLetters = async () => {
    const Letters = await axios.get(host + '/letters')
    const letters = decrptObject(Letters.data)
    return letters
}
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