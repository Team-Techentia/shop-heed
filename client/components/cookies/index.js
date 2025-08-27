import { parseCookies, setCookie as nookiesSetCookie, destroyCookie } from 'nookies';

export const setCookie = (ctx, name, value, days) => {
  const maxAge = days * 24 * 60 * 60; 
  nookiesSetCookie(ctx, name, value, {
    maxAge,
    path: '/',
  });
};

export const getCookie = (name) => {
  
  const cookies = parseCookies();
  const token =  cookies[name] || null;

  if (token === null) {
    
    return null;
  }

  return {
    headers: {
        Authorization: `Bearer ${token || ""}`
    }
};
};

export const deleteCookie = (ctx, name) => {
  destroyCookie(ctx, name, {
    path: '/',
  });
};
