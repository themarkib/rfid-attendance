import React from 'react'
import NavBar from '../component/NavBar'
import AddForm from '../component/AddForm'
import useAuth from '../hooks/useAuth';



const AddUser = () => {
  const isAuthenticated = useAuth();

    if (!isAuthenticated) {
      console.log("token not found");
        return null; // Optionally return a loading spinner or null while checking
    }
  return (
    <div>
        <NavBar/>
        <AddForm/>
    </div>
  )
}

export default AddUser