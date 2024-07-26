import React from 'react'
import ManageUserTable from '../component/ManageUserTable'
import NavBar from '../component/NavBar'
import useAuth from '../hooks/useAuth';

const ManageUser = () => {
  const isAuthenticated = useAuth();

    if (!isAuthenticated) {
      console.log("token not found");
        return null; // Optionally return a loading spinner or null while checking
    }
  return (
    <div>
      <NavBar/>
      <ManageUserTable/>
    </div>
  )
}

export default ManageUser