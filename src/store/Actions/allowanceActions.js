import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchAllowances= async () => {
    const Allowances= await axios.get(host + '/allowances')
    const allowances= decrptObject(Allowances.data)
    return allowances
}
export const addAllowances= (Allowances) => {
    return {
        type: 'ADD_ALLOWANCES', payload: Allowances
    }
}
export const loadingAllowances= () => {
    return {
        type: 'LOADING_ALLOWANCES'
    }
}