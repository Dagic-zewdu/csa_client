import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchDepartment = async () => {
    const Department = await axios.get(host + '/department')
    const department = decrptObject(Department.data)
    return department
}
export const addDepartment = (Department) => {
    return {
        type: 'ADD_DEPARTMENT', payload: Department
    }
}
export const loadingDepartment = () => {
    return {
        type: 'LOADING_DEPARTMENT'
    }
}