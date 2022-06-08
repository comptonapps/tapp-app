import { store } from "../index";
import axios from "axios";

const token = () => store.getState().sessionState.token;

//axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

class Axios {
  static async get(url) {
    return await axios({
      method: "get",
      url,
      headers: {
        authorization: `Bearer ${token()}`
      }
    });
  }

  static async post(url, data) {
    return await axios({
      method: "post",
      url,
      headers: {
        authorization: `Bearer ${token()}`
      },
      data
    });
  }

  static async patch(url, data) {
    return await axios({
      method: "patch",
      url,
      headers: {
        authorization: `Bearer ${token()}`
      },
      data
    });
  }

  static async delete(url) {
    return await axios({
      method: "delete",
      url,
      headers: {
        authorization: `Bearer ${token()}`
      }
    });
  }
}

export default Axios;
