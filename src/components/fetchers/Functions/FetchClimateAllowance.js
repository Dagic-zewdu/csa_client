import { addClimatePlaces, fetchClimatePlaces, loadingClimatePlaces } from "../../../store/Actions/climatePlacesActions"

export  const fetchData_climate=async (dispatch)=>{
    try{
  let places=await fetchClimatePlaces()
  dispatch(addClimatePlaces(places))
    }  
    catch(err){
        console.log(err)
     dispatch({type:'ERROR'})
    }
  }