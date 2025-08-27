import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '../cookies';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("ectoken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/page/account/login'); 
    }
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
