import {Navigate, defer} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "./js/tokenApi"
import { REFRESH_TOKEN,ACCESS_TOKEN } from '../constants'
import { useEffect, useState } from "react"

function ProtectedRoute({children}){
    const [isAuthorized, setIsAuthorized]= useState(null); //Default Null variables.
    
    useEffect(()=>{ //if any error, auth-> False
        auth().catch(()=> setIsAuthorized(false))
    },[])
    
    const refreshToken= async() =>{ //Refresh Automatically
        const refreshToken=localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("api/authApp/token/refresh/",{
                refresh:refreshToken,
            });

            if(res.status===200){
                localStorage.setItem(ACCESS_TOKEN,res.data.access);
                setIsAuthorized(true);
            }else{
                setIsAuthorized(false);
            }

        }catch(error){
            console.log(error);
            setIsAuthorized(false);
        }
    };
    
    const auth= async() =>{ //Check if we need to refresh
        const token =localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorized(false);
            return ;
        }
        //if we have the token, decode it and set expiration
        const decoded=jwtDecode(token); //decoded token
        const tokenExpiration = decoded.exp; //expiration in secs
        const now = Date.now()/1000  ;   //date in seconds 
        
        if (tokenExpiration < now){//expired
            await refreshToken()   ;
        }else{
            setIsAuthorized(true);
        }


    };

    if (isAuthorized===null){
        return <div>Loading...</div>
    }
    return isAuthorized? children:<Navigate to="/login"/>
}
export default ProtectedRoute