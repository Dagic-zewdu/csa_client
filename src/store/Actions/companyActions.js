import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchCompany= async () => {
    const Company= await axios.get(host + '/company')
    const company= decrptObject(Company.data)
    return company
}
export const addCompany= (Company) => {
    return {
        type: 'ADD_COMPANY', payload: Company
    }
}
export const loadingCompany= () => {
    return {
        type: 'LOADING_COMPANY'
    }
}