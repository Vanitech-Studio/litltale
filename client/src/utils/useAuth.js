import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { fetchAPI } from './api';

const useAuth = () => {
    const [auth, setAuth] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const verifyToken = async () => {
        const tokenFromCookie = Cookies.get('accessToken');
  
        setToken(tokenFromCookie);
        setAuth(true);

        if(tokenFromCookie){
          try {
            const code = await fetchCode(tokenFromCookie);
            //console.log(code);
          } catch (error) {
            toast.error(error.message, {
              theme: 'dark',
              autoClose: 1000,
              hideProgressBar: true,
            }); 
            Cookies.remove('accessToken');
            Cookies.remove('auth');
            router.push("/");
          }
        } else {
          router.push("/");
        }
        
      };
      
      verifyToken();
    }, []);
  
    const fetchCode = async (token) => {
      const res = await fetchAPI(`/beta-users?filters[access_code][$eq]=${token}`);
      console.log("User : ", res)
      if (!res.data || res.data.length === 0) {
        throw new Error('Wrong beta access code.');
      }
      return res.data[0].attributes.access_code;
    };
  
    return { auth, token };
  };
  
  export default useAuth;