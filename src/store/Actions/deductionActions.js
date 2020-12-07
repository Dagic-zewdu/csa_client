import axios from 'axios'
import {host} from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchDeductions = async () => {
    const deductions = await axios.get(host + '/deductions')
    const Deductions = decrptObject(deductions.data)
    return Deductions
}
export const addDeductions = (Deductions) => {
    return {
        type: 'ADD_DEDUCTIONS', payload: Deductions
    }
}
export const loadingDeductions = () => {
    return {
        type: 'LOADING_DEDUCTIONS'
    }
}