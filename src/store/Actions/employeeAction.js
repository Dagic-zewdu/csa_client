import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchEmployees = async () => {
    const employees = await axios.get(host + '/employee')
    const Employees = decrptObject(employees.data)
    return Employees
}
export const addEmployees = (employees) => {
    return {
        type: 'ADD_EMPLOYEES', payload: employees
    }
}
export const loadingEmployees = () => {
    return {
        type: 'LOADING_EMPLOYEES'
    }
}