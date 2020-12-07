import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchPlaces = async () => {
    const Places = await axios.get(host +'/places')
    const places = decrptObject(Places.data)
    return places
}
export const addPlaces = (places) => {
    return {
        type: 'ADD_PLACES', payload: places
    }
}
export const loadingPlaces = () => {
    return {
        type: 'LOADING_PLACES'
    }
}