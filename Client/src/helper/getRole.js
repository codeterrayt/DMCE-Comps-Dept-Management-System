

export const getRole = () =>{
    const userInSession = localStorage.getItem('dmceuser')
    if(userInSession){
        const user = JSON.parse(userInSession)
        return user.role
    }
    return null
 
}