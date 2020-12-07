import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchConfig = async () => {
    const Config = await axios.get(host + '/config')
    const config = decrptObject(Config.data)
    return config
}
export const addConfig = (Config) => {
    return {
        type: 'ADD_CONFIG', payload: Config
    }
}
export const loadingConfig = () => {
    return {
        type: 'LOADING_CONFIG'
    }
}