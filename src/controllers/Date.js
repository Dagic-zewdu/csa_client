import axios from "axios"
import { decrptObject } from "../components/auth/encrypt"
import { host } from "../components/config/config"
import {ethDateTime,converterDateTime,converterString} from 'ethiopian-calendar-date-converter'
var etdate=require('ethiopic-date')
/**get Date from the server */
export const getDate=async ()=>{
const Time=await axios.get(host+'/date')
const DATE=new Date(Time.data.date)
return DATE.toISOString()
}

export const DateFormat=(DATE)=>{
    const date=new Date(DATE)
    const year=date.getFullYear()
    const Month=date.getMonth()
    let month=parseInt(Month)<10?'0'+Month:Month
    let day=date.getDate()
    let Day=parseInt(day)<10?'0'+day:day
    return year+'-'+month+'-'+Day
}

 /**returns duration of day btn to isoString dates */
 export const durationDays=(initial_date,destination_date)=>{
    let i_date=new Date(initial_date) 
    let d_date=new Date(destination_date)
    let duration=d_date.getTime()-i_date.getTime()
      return duration/(1000*3600*24)
 }  
/**accepts initial date and destination date and check duration is valid */
export const checkDate=(initial_date,destination_date)=>
 durationDays(initial_date,destination_date)<0? false:true
       
 export const FullDay=(Day)=>{
     let date=new Date(Day)
     return date.toUTCString()
 }
 /**returns utc date representation string removing the time */
 export const TellDay=(day)=>{
     let date=new Date(day)
     return date.toUTCString().slice(0,16) 
 }
 export const tellTime=(day)=>{
    let date=new Date(day)
    let hour=date.getHours()
    let minute=date.getMinutes()
    return hour+':'+minute
 }
 /**converts  ethiopian date to gregorian calander in iso format */   
 export const convertToEuropean=(dd,mm,yyyy,hr,min,sec)=>{
     let Hr=hr?hr:1
     let Min=min?min:0
     let Sec=sec?sec:0
    const eth=new ethDateTime(dd,mm,yyyy,Hr,Min,Sec)
    const gr=new Date( converterDateTime.toEuropean(eth))
    return gr.toISOString()
 }
 /**converts gregorian calander to ethiopian date string */
 export const ToEthiopianDateSting=(DATE)=>{
     const date=new Date(DATE)
     const day=parseInt(date.getUTCDay())
     const ken=day===1?'ሰኞ':day===2?'ማክሰኞ':day===3?'ረቡዕ':day===4?'ሐሙስ':
         day===5?'አርብ':day===6?'ቅዳሜ':day===7?'እሁድ':''
     const Month=parseInt(converterDateTime.toEthiopian(date).month)
     const DAte=parseInt(converterDateTime.toEthiopian(date).date) 
     const {year}=converterDateTime.toEthiopian(date)
     const month=Month===1?'መስከረም':Month===2?'ጥቅምት':Month===3?'ህዳር':Month===4?'ታህሳስ':
    Month===5?'ጥር':Month===6?'የካቲት':Month===7?'መጋቢት':Month===8?'ሚያዝያ':Month===9?'ግንቦት':
    Month===10?'ሰኔ':Month===11?'ሐምሌ':Month===12?'ነሐሴ':Month===13?'ጳጉሜ':''   
   return ken+' '+DAte+' '+month+' '+year  
}
/**returns object of date,month,year with gc calander as parameter
 * @param DATE-accepts date value of gc isostring
 */
export const toEthiopianDate=(DATE)=>{
    const date=new Date(DATE)
    return converterDateTime.toEthiopian(date)
}
/**accepts month number and returns month string */
export const toEthiopianMonth=Month=>Month===1?'መስከረም':Month===2?'ጥቅምት':Month===3?
'ህዳር':Month===4?'ታህሳስ':Month===5?'ጥር':Month===6?'የካቲት':Month===7?
'መጋቢት':Month===8?'ሚያዝያ':Month===9?'ግንቦት':Month===10?'ሰኔ':Month===11?
'ሐምሌ':Month===12?'ነሐሴ':Month===13?'ጳጉሜ':''
/**accepts initial month number and return month.
 *  returns array of months object {number:1,month:String}
 * that is duration btn initial and return month to Ethiopian string
 * @param imonth=>is the initial month
 * @param rmonth=>is the return month 
 */
export const durationMonth=(imonth,rmonth)=>{
    let duration=rmonth-imonth<0?(13-imonth)+rmonth:rmonth-imonth
    var months=[],x,j=0
      for(var i=0;i<=duration;i++){
     i+imonth>13?months.push({
         number:rmonth-j ,
        month:toEthiopianMonth(rmonth-j)}):x=0
     i+imonth<=13?months.push({
        number:i+imonth, 
        month:toEthiopianMonth(i+imonth)}):j++      
      }
      return months
}
/**return array of years btn two years */
export const durationYears=(initial_year,final_year)=>{
   let duration=final_year-initial_year
   var years=[]
   for(var i=0;i<=duration;i++){
      years.push(i+initial_year)
   }
   return years
}
/**returns a string of local time formatted like this (11:00 am)  */
export const localTime=DATE=>{
   const date=new Date(DATE)
   const time=date.toLocaleTimeString()
   const t=time.split(':')
  const local= t[2].split(' ')
  return t[0]+':'+t[1]+' '+(local[1]?local[1]:'')
}
/**return astring of month contactenated like (dec 2 2020) */
export const simpleDate=DATE=>{
    const date=TellDay(DATE)
    const d=date.split(',')
    return d[1]
}