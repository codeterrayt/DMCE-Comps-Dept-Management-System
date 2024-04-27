export const getToken = () => {
  const userInSession = localStorage.getItem("dmceuser");
  if (userInSession) {
    const token = JSON.parse(userInSession).token;
    return token;
  }
  return false;
};
