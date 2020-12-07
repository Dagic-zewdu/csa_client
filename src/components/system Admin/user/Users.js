import React, { useState, useEffect } from 'react'
import { LayoutContext, StoreContext } from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import UserModal from '../../layout/UserModal'
import { useContext } from 'react'
import { faUser, faUserAlt, faUserCircle, faPenFancy, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTableHead, MDBTableBody, MDBTable } from 'mdbreact'
import { DotLoading } from '../../layout/Loading'
import { loadingUsers, fetchUsers, addUsers } from '../../../store/Actions/userActions'
import { searchUsers } from '../../../controllers/search'

 const Users=()=> {
     //state
   const [state,setState]=useState({
       found: false,
       Users:[]
   })
   //getting data from reducer
   const {users,dispatchUsers}=useContext(StoreContext)
   const {state:Users,loading,error}=users
   //setting state from the reducer
   useEffect(()=>{
     setState({...state,Users})
   },[loading])
    const fetch= async ()=>{
        try
       {
           dispatchUsers(loadingUsers())
       const USERS=await fetchUsers()
       dispatchUsers(addUsers(USERS))
    }
    catch(err){
        dispatchUsers({type:'ERROR'})
    } 
    }
   //searching user with the index
   const handleSearch=(index)=>{
/**searching algorithm written on the function searchUsers */
let result=index===''?Users:searchUsers(Users,index)
let found=index===''?false:true
   setState({...state,Users:result,found})
   }
   const listUsers=loading?
   (
   <tr>
       <td  className='row text-center' colSpan='5'><DotLoading/></td>
       </tr>
       ):
       error?
       <tr>
          <td className='text-danger text-danger' colSpan='5'>
              Loading users failed  because server is not active
              contact system admin to activate it
              </td> 
       </tr>:
       state.Users.length?
  (state.Users.map(u=>{
     return(
         <tr key={u._id}>
  <td>{u.emp_id}</td>
  <td>{u.username}</td>
  <td>{u.user_type}</td>
  <td>{u.access}</td>
  <td className='row'>
      <UserModal type='reset' user={u} fetch={fetch} />
      <p className="text-danger mx-2">|</p>
      <UserModal type='access' user={u} fetch={fetch} />
      <p className="text-danger mx-2">|</p>
      <UserModal type='delete' user={u} fetch={fetch}/>
      </td>
         </tr>
     )
  })):(
  <tr>
  <td  colSpan='5'>No users created account</td>
  </tr>
  )
   return (
        <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <AdminNavbar/>
       <div className="app-main">
        <AdminSideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
                        <div className="row">
                        <div className="col-lg-3 my-auto">
                  </div>
             <div className="col-lg-5 my-auto">
  <div className="col-lg-5 my-auto">
                                <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" placeholder="Type id,username,usertype,useraccess"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span>
                                </span>
                                </button>
                        </div>
    
                    </div>                                   
                            </div>
                 </div>
                 <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-arielle-smile">
                <div class="widget-content-wrapper text-white">
                    <div class="widget-content-left">
                        <div class="widget-heading">Totall Employees</div>
                        <div class="widget-subheading">Created account</div>
                    </div>
    <div class="widget-content-right">
        <div class="widget-numbers text-white">
            <span>
                {Users.length}
                </span>
                </div>
    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-12">
        <div className="main-card mb-3 card mt-2" > 
    {
        state.found?
          <h5 className="text-center">
        users found:{state.Users.length}</h5>
   : 
        <p></p>      
         }
                                                  
                  <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faUser} className='mx-2'/>                         
          Employee id
                             </th>
               <th>
               <FontAwesomeIcon icon={faUserAlt} className='mx-2' />              
           Username
           </th>

                              <th>
          <FontAwesomeIcon icon={faUserCircle} className='mx-2' />                        
                    User type
                </th>
                <th>
          <FontAwesomeIcon icon={faCheckCircle} className='mx-2' />                        
                    Access
                </th>
             <th>
                <FontAwesomeIcon icon={faPenFancy} className='mx-2' />                 
                                  operation
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listUsers}
                      </MDBTableBody>
                  </MDBTable>    
                  </div>    
            </div>                                      
                </div>
                </div>
                </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Users

