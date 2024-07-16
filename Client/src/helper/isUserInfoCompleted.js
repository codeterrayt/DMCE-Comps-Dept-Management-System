import axios from "axios";
import { getToken } from "./getToken";

function checkFieldsNotNull(data) {
  for (let key in data) {
    if (key !== "email_verified_at") {
      if (data[key] === null) {
        return false;
      }
    }
  }
  return true;
}

export const isUserInfoCompleted = () => {
  return new Promise((resolve, reject) => {
    try {
      const token = getToken();

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVER_DOMAIN}/fetch/profile`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          const result = checkFieldsNotNull(response?.data);
          if (result == true) {
            const user = localStorage.getItem("dmceuser");
            if (user) {
              const userInsession = JSON.parse(user);
              const data = {
                ...userInsession,
                profile_completed: true,
              };
              localStorage.setItem("dmceuser", JSON.stringify(data));
            }

            return resolve(response.status);
          }
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
          reject(error.response.status);
        });
    } catch (error) {
      reject(error);
    }
  });
};
