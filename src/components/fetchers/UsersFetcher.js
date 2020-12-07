import React, { useEffect ,useContext } from 'react'
import { fetchUsers, loadingUsers, addUsers } from '../../store/Actions/userActions'
import { StoreContext } from '../contexts/contexts'

  const UsersFetcher=()=> {
    const {dispatchUsers}=useContext(StoreContext)  
    
    useEffect(()=>{
        const getUsers=async ()=>{
       try{
        //loading users
        dispatchUsers(loadingUsers())     
        //fectching users
            const users= await fetchUsers()
            //storing to reducer
            dispatchUsers(addUsers(users)) 
       } 
       catch(err){
         dispatchUsers({type:'ERROR'})
       }
      }
      getUsers()
    },[dispatchUsers])
    return (
     <p></p>
    )
}

export default UsersFetcher
