const getURL = () => {
    //return "https://smc-peru.com/api";
    //return "http://localhost:3000/api";
    return import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
  };
  
    export default getURL;