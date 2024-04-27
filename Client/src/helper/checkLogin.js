export const checkLogin = () => {
  const userInSession = localStorage.getItem("dmceuser");
  if (userInSession) {
    const token = JSON.parse(userInSession).token;

    if (token) {
      return true;
    } else {
      return false;
    }
  }
};
