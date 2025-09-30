import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '../cookies';

const useAuth = (navigate = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("ectoken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (navigate)
        router.push('/');
    }
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
