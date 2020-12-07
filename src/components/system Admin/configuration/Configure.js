import React,{ useState, useContext } from 'react'
import {LayoutContext, StoreContext} from '../../contexts/contexts'
import AdminNavbar from '../../layout/Navbar/AdminNavbar'
import AdminSideNav from '../../layout/SideNav/AdminSideNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { SpinnerLoading } from '../../layout/Loading'
import { loadingConfig, fetchConfig, addConfig } from '../../../store/Actions/configActions'
import ModalConfig from '../../layout/ModalConfig'
const Configure=()=> {
    const [state,setState]=useState({
        collapse : '',
        })
  //importing states from redux
    const {config,dispatchConfig}=useContext(StoreContext)
  const {state:CONFIG,loading,error}=config  
    const Config=CONFIG[0]
  //fetching if any change occurs
  const fetch=async ()=>{
    /**pupulating with new data */
    try{
dispatchConfig(loadingConfig())
const config=await fetchConfig()
/**updating redux store */
dispatchConfig(addConfig(config))
    }
    catch(err){
        dispatchConfig({type:'ERROR'})
    }
}
 return (
        <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <AdminNavbar/>
       <div className="app-main">
        <AdminSideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
              {
                  loading?
                  <div className="mt-5">
               <SpinnerLoading/>  
                  </div>:
               error?
               <p className="text-center mt-5 text-danger">
              Server is not active loading failed    
                   </p>:             
                        <div className="row">
        {/***Title */}
        <div class="app-page-title">
<div class="page-title-wrapper">
    <div class="page-title-heading">
        <div class="page-title-icon">
            <FontAwesomeIcon icon={faMoneyBill} 
            className='pe-7s-car icon-gradient bg-mean-fruit text-warning' />
           
        </div>
        <div>
     Allowances      
           <div class="page-title-subheading">
   This is an allowance that is configured before. it tells allowances that
   used to calculate day allowance,living allowance and climate allowance
            </div>
        </div>
    </div>
    <div class="page-title-actions mx-4">
      <div class="d-inline-block dropdown">
            <ModalConfig config={Config} fetch={fetch} />
        </div>
    </div>  
    </div>
</div>      
        {/** */}   
        <div className="col-lg-12 mt-3">
        <div class="row">
<div class="col-md-6 col-lg-4 mx-auto">
    <div class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card">
        <div class="widget-content">
            <div class="widget-content-outer">
                <div class="widget-content-wrapper">
                    <div class="widget-content-left pr-2 fsize-1">
                        <div class="widget-numbers mt-0 fsize-3 text-danger">{Config.breakfast}%</div>
                    </div>
                    <div class="widget-content-right w-100">
                        <div class="progress-bar-xs progress">
        <div class="progress-bar bg-danger" role="progressbar"
         aria-valuenow={Config.breakfast} aria-valuemin="0"
          aria-valuemax="100" style={{width: Config.breakfast+'%'}}></div>
    </div>
                    </div>
                </div>
                <div class="widget-content-left fsize-1">
                    <div class="text-muted opacity-6">Breakfast allowance </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
<div class="card-shadow-success mb-3 widget-chart widget-chart2 text-left card">
<div class="widget-content">
    <div class="widget-content-outer">
        <div class="widget-content-wrapper">
            <div class="widget-content-left pr-2 fsize-1">
                <div class="widget-numbers mt-0 fsize-3 text-success">
                    {Config.lunch}%
                    </div>
            </div>
            <div class="widget-content-right w-100">
    <div class="progress-bar-xs progress">
        <div class="progress-bar bg-success" 
        role="progressbar" aria-valuenow={Config.lunch}
            aria-valuemin="0" aria-valuemax="100" style={{width:Config.lunch+'%'}}></div>
    </div>
            </div>
        </div>
        <div class="widget-content-left fsize-1">
            <div class="text-muted opacity-6">Lunch allowance</div>
        </div>
    </div>
</div>
</div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
<div class="card-shadow-warning mb-3 widget-chart widget-chart2 text-left card">
    <div class="widget-content">
        <div class="widget-content-outer">
            <div class="widget-content-wrapper">
                <div class="widget-content-left pr-2 fsize-1">
                    <div class="widget-numbers mt-0 fsize-3 text-warning">{Config.dinner}%</div>
                </div>
                <div class="widget-content-right w-100">
                    <div class="progress-bar-xs progress">
                        <div class="progress-bar bg-warning"
     role="progressbar" aria-valuenow={config.dinner} aria-valuemin="0"
      aria-valuemax="100" style={{width: Config.dinner+'%'}}></div>
                    </div>
                </div>
            </div>
            <div class="widget-content-left fsize-1">
                <div class="text-muted opacity-6">Dinner allowance</div>
            </div>
        </div>
    </div>
</div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
<div class="card-shadow-info mb-3 widget-chart widget-chart2 text-left card">
    <div class="widget-content">
        <div class="widget-content-outer">
            <div class="widget-content-wrapper">
                <div class="widget-content-left pr-2 fsize-1">
                    <div class="widget-numbers mt-0 fsize-3 text-info">
                        {Config.bed}%
                        </div>
                </div>
                <div class="widget-content-right w-100">
                    <div class="progress-bar-xs progress">
          <div class="progress-bar bg-info" 
          role="progressbar" aria-valuenow={config.bed} aria-valuemin="0" 
          aria-valuemax="100" style={{width: Config.bed+'%'}}></div>
                    </div>
                </div>
            </div>
            <div class="widget-content-left fsize-1">
                <div class="text-muted opacity-6">Bed allowance</div>
            </div>
        </div>
    </div>
</div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
<div class="card-shadow-warning mb-3 widget-chart widget-chart2 text-left card">
    <div class="widget-content">
        <div class="widget-content-outer">
            <div class="widget-content-wrapper">
                <div class="widget-content-left pr-2 fsize-1">
                    <div class="widget-numbers mt-0 fsize-3 text-warning">{Config.climate_1}%</div>
                </div>
                <div class="widget-content-right w-100">
                    <div class="progress-bar-xs progress">
                        <div class="progress-bar bg-warning"
     role="progressbar" aria-valuenow={Config.climate_1} aria-valuemin="0"
      aria-valuemax="100" style={{width: Config.climate_1+'%'}}></div>
                    </div>
                </div>
            </div>
            <div class="widget-content-left fsize-1">
                <div class="text-muted opacity-6">Climate level 1 allowance</div>
            </div>
        </div>
    </div>
</div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
    <div class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card">
        <div class="widget-content">
            <div class="widget-content-outer">
                <div class="widget-content-wrapper">
                    <div class="widget-content-left pr-2 fsize-1">
                        <div class="widget-numbers mt-0 fsize-3 text-danger">
                            {Config.climate_2}%
                            </div>
                    </div>
                    <div class="widget-content-right w-100">
                        <div class="progress-bar-xs progress">
        <div class="progress-bar bg-danger" role="progressbar"
         aria-valuenow={Config.climate_2} aria-valuemin="0"
          aria-valuemax="100" style={{width:Config.climate_2+'%'}}></div>
    </div>
                    </div>
                </div>
                <div class="widget-content-left fsize-1">
                    <div class="text-muted opacity-6">Climate level 2 allowance </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col-md-6 col-lg-4 mx-auto">
<div class="card-shadow-success mb-3 widget-chart widget-chart2 text-left card">
<div class="widget-content">
    <div class="widget-content-outer">
        <div class="widget-content-wrapper">
            <div class="widget-content-left pr-2 fsize-1">
                <div class="widget-numbers mt-0 fsize-3 text-success">
                    {Config.climate_3}%
                    </div>
            </div>
            <div class="widget-content-right w-100">
    <div class="progress-bar-xs progress">
        <div class="progress-bar bg-success" 
        role="progressbar" aria-valuenow={Config.climate_3}
            aria-valuemin="0" aria-valuemax="100" style={{width:Config.climate_3+'%'}}></div>
    </div>
            </div>
        </div>
        <div class="widget-content-left fsize-1">
            <div class="text-muted opacity-6">Climate level 3 allowance </div>
        </div>
    </div>
</div>
</div>
</div>
</div>
          </div>                                      
                </div>
                }
                </div>
                </div>
       </div>
       </LayoutContext.Provider>    
        </div>
    )
}

export default Configure
