export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const setToken = (token) => {
    localStorage.setItem("token", token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem("token");
  };
  
  export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
  };
  
  export const setRefreshToken = (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
  };
  
  export const removeRefreshToken = () => {
    localStorage.removeItem("refreshToken");
  };
  
  export const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };