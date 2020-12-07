import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchFieldAllowance = async () => {
    const fieldAllowance = await axios.get(host + '/fieldAllowance')
    const FieldAllowance = decrptObject(fieldAllowance.data)
    return FieldAllowance
}
export const addFieldAllowance = (FieldAllowance) => {
    return {
        type: 'ADD_FIELDALLOWANCE', payload: FieldAllowance
    }
}
export const loadingFieldAllowance = () => {
    return {
        type: 'LOADING_FIELDALLOWANCE'
    }
}