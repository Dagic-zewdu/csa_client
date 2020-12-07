import React, { useContext, useState } from 'react'
import AdminNavbar from '../../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../../layout/SideNav/AdminSideNav'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faSun, faPenFancy } from '@fortawesome/free-solid-svg-icons'
import ModalClimatePlaces from '../../../layout/ModalClimatePlace'
import { LayoutContext, StoreContext } from '../../../contexts/contexts'
import { fetchData_climate } from '../../../fetchers/Functions/FetchClimateAllowance'
import { climateClass } from '../../../../controllers/climatePlaces'
import { useEffect } from 'react'
import { DotLoading } from '../../../layout/Loading'
import { removeDuplicates } from '../../../../controllers/removeRedudant'
import { randomId } from '../../../../controllers/saveProcess'

  const ClimateDashboard=()=> {
    const [state,setState]=useState({
        collapse:'',
        places:[],
        general_name:[],
        found:false,
    })
 const {climatePlaces,dispatchClimatePlaces}=useContext(StoreContext)
 const {state:Places,loading,error}=climatePlaces
 const climate=new climateClass(Places)
 const fetch=()=>fetchData_climate(dispatchClimatePlaces) 
 /** */
 const general_name=removeDuplicates([...Places.map(p=>{
    return {id:randomId(),general_name:p.general_name}
 })],'general_name')
 
 useEffect(()=>{
    fetchData_climate(dispatchClimatePlaces)
    setState({...state,places:Places,general_name})
 },[Places.length,loading,JSON.stringify(Places)]) 
 
 /**list places */
  const listPlaces=loading?(
      <tr>
          <td  className='row text-center' colSpan='5'><DotLoading/></td>
          </tr>
          ):
          error?
       <tr>
              <td className='text-danger text-danger' colSpan='5'>
                  Loading  failed  because server is not active
                  contact system admin to activate it
                  </td> 
           </tr>:
          state.places.length?
     (state.general_name.map(p=>{
        return(
            <tr key={p.id}>
     <td>{p.general_name}</td>
     <td className='text-center'>
    {
        climate.findGname_level_1(p.general_name).length?
        climate.findGname_level_1(p.general_name).map(gp=>{
            return(
                <p  key={gp._id}>
                    {gp.name},
                    </p>
            )
        })
        :<p className="text-center font-weight-bold">
       No place added
        </p>

    }  
     </td>
     <td className='text-center'>
         {
            climate.findGname_level_2(p.general_name).length?
        climate.findGname_level_2(p.general_name).map(gp=>{
            return(
                <p  key={gp._id}>
                    {gp.name},
                    </p>
            )
        })
        :<p className="text-center font-weight-bold">
       No place added
        </p>
        
         }
    </td>
     <td className='text-center'>
     {
            climate.findGname_level_3(p.general_name).length?
        climate.findGname_level_3(p.general_name).map(gp=>{
            return(
                <p  key={gp._id}>
                    {gp.name},
                    </p>
            )
        })
        :<p className="text-center font-weight-bold">
       No place added
        </p>
        
         } 
         </td>
      <td>
      <ModalClimatePlaces type='add_place' fetch={fetch}
       general_name={p.general_name} className='my-2' />
      <ModalClimatePlaces type='edit_gname'  fetch={fetch}
      general_name={p.general_name} className='my-2' /> 
      <ModalClimatePlaces type='remove_places'  fetch={fetch}
      general_name={p.general_name}
      level_1={climate.findGname_level_1(p.general_name)}
      level_2={climate.findGname_level_2(p.general_name)}
      level_3={climate.findGname_level_3(p.general_name)} 
      className='my-2' />
          </td>   
            </tr>
        )
     })):(
     <tr>
     <td  colSpan='5'>No Places yet</td>
     </tr>
     )
     const handleSearch=(index)=>{
   let places=index===''?Places:climate.searchPlace(index)
   let found=index===''?false:true
   let general_name=removeDuplicates([...places.map(p=>{
    return { id:randomId(), general_name:p.general_name}
           })],'general_name')
   setState({...state,places,found,general_name}) 
     }
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
          {/**create climate allowances */}
      <ModalClimatePlaces type='create_place' fetch={fetch} />    
          </div>
              <div className="col-lg-3 my-auto">
                              <div className="search-wrapper active">
                      <div className="input-holder">
<input type="text" className="search-input" placeholder="Type name,region or place type"
onChange={e=>handleSearch(e.target.value)}
/>
<button className="search-icon">
                              <span></span>
                              </button>
                      </div>
  
                  </div>                                   
      </div> 
      <div class="col-md-3 col-xl-3 col-lg-3">
          <div class="card mb-3 widget-content bg-midnight-bloom">
              <div class="widget-content-wrapper text-white">
                  <div class="widget-content-left">
                      <div class="widget-heading">General place name</div>
                      <div class="widget-subheading">Totall registered</div>
                  </div>
                  <div class="widget-content-right">
                      <div class="widget-numbers text-white"><span>
                          {general_name.length}
                          </span></div>
                  </div>
              </div>
          </div>
      </div>
      <div class="col-md-3 col-xl-3 col-lg-3">
          <div class="card mb-3 widget-content bg-grow-early">
              <div class="widget-content-wrapper text-white">
                  <div class="widget-content-left">
                      <div class="widget-heading">Places</div>
                      <div class="widget-subheading">Totall registered</div>
                  </div>
                  <div class="widget-content-right">
                      <div class="widget-numbers text-white"><span>
                          {Places.length}
                          </span></div>
                  </div>
              </div>
          </div>
      </div>
      <div className="col-lg-12">
                          <div className="main-card mb-3 card mt-2" > 
  {
      state.found?
        <h5 className="text-center">places found:{state.places.length}</h5>
 : <p></p>      
       }
                                                
                <MDBTable hover>
                    <MDBTableHead>
                        <tr>
                        <th>
        <FontAwesomeIcon icon={faMap} className='mx-2' />                        
                  General Place name
              </th>
                            <th>
    <FontAwesomeIcon icon={faSun} className='mx-2'/>                            
                        level 1 Allowance places
                           </th>
             <th>
             <FontAwesomeIcon icon={faSun} className='mx-2' />              
                 Level 2 Allowance places
         </th>
         <th>
             <FontAwesomeIcon icon={faSun} className='mx-2' />              
             Level 3 Allowance places
         </th>
         <th>
               <FontAwesomeIcon icon={faPenFancy} className='mx-2' />              
                   operation
           </th>         
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {listPlaces}
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

export default ClimateDashboard
