import React,{useState, useContext, useEffect} from 'react'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import { LayoutContext, StoreContext } from '../../contexts/contexts'
import ModalPlaces from '../../layout/MoadalPlace'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faCity, faMoneyBill, faPenFancy } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { loadingPlaces, fetchPlaces, addPlaces } from '../../../store/Actions/placeActions'
import { searchPlaces } from '../../../controllers/search'

  const PlaceDashbord=()=> {
    const {place,dispatchPlaces}=useContext(StoreContext)
      const {state:places,loading,error}=place  
    const [state,setState]=useState({
          collapse:'',
          places:[],
          found:false
      })
    useEffect(()=>{
setState({...state,places})
    },[loading])
    /**fetching if any change occurs */
    const fetch = async ()=>{
        try{
        dispatchPlaces(loadingPlaces())
        const Places=await fetchPlaces()
        dispatchPlaces(addPlaces(Places))
    }
    catch(err){
    dispatchPlaces({type:'ERROR'})
    }
    }  
      const handleSearch=(index)=>{
 /**searching algorithm written on the function */
 const result=index===''?places:searchPlaces(places,index)
 let found=index===''?false:true
    setState({...state,places:result,found})
    }
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
       (state.places.map(r=>{
          return(
              <tr key={r._id}>
       <td>{r.name}</td>
       <td>{r.region}</td>
       <td>{r.type}</td>
       <td className='row'>
           <ModalPlaces type='view_places' places={r} />
           <p className="text-danger mx-2">|</p> 
           <ModalPlaces type='edit_places' places={r} fetch={fetch} />
           <p className="text-danger mx-2">|</p>
           <ModalPlaces type='delete_places' places={r} fetch={fetch} />
           </td>
              </tr>
          )
       })):(
       <tr>
       <td  colSpan='5'>No Places yet</td>
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
            <ModalPlaces type='create_place' fetch={fetch} />    
                </div>
                <div className="col-lg-5 my-auto">
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
        <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content bg-grow-early">
                <div class="widget-content-wrapper text-white">
                    <div class="widget-content-left">
                        <div class="widget-heading">Places</div>
                        <div class="widget-subheading">Totall registered</div>
                    </div>
                    <div class="widget-content-right">
                        <div class="widget-numbers text-white"><span>
                            {places.length}
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
          <FontAwesomeIcon icon={faCity} className='mx-2' />                        
                     Name
                </th>
                              <th>
      <FontAwesomeIcon icon={faFlag} className='mx-2'/>                            
                                  Region
                             </th>
               <th>
               <FontAwesomeIcon icon={faCity} className='mx-2' />              
                   place type
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

export default PlaceDashbord
