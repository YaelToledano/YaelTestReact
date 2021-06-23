import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:44330/api",
    headers: {
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      "Content-type": "application/json"
    }
  });