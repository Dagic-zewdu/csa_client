import axios from 'axios'
import { host } from '../../components/config/config'
import { decrptObject } from '../../components/auth/encrypt'
export const fetchUsers = async () => {
    const Users = await axios.get(host + '/users')
    const users = decrptObject(Users.data)
    return users
}
export const addUsers = (Users) => {
    return {
        type: 'ADD_USERS', payload: Users
    }
}
export const loadingUsers = () => {
    return {
        type: 'LOADING_USERS'
    }
}