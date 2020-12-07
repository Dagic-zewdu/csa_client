import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchClimatePlaces = async () => {
    const cp = await axios.get(host + '/climatePlaces')
    const places = decrptObject(cp.data)
    return places
}
export const addClimatePlaces = (Places) => {
    return {
        type: 'ADD_PLACES', payload: Places
    }
}
export const loadingClimatePlaces = () => {
    return {
        type: 'LOADING_PLACES'
    }
}