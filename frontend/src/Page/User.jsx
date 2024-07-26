import React from 'react'
import NavBar from '../component/NavBar'
import UserTable from '../component/UserTable'
import useAuth from '../hooks/useAuth';


const User = () => {
  const isAuthenticated = useAuth();

    if (!isAuthenticated) {
      console.log("token not found");
        return null; // Optionally return a loading spinner or null while checking
    }
  return (
    <div>
            <NavBar/>
            <UserTable/>
    </div>
  )
}

export default User