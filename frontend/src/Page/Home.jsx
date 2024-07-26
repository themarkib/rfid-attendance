import React from 'react';
import HomeTable from '../component/HomeTable';
import NavBar from '../component/NavBar';
import useAuth from '../hooks/useAuth'; // Adjust the import path as needed

const Home = () => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
      console.log("token not found");
        return null; // Optionally return a loading spinner or null while checking
    }

    return (
        <div>
            <NavBar />
            <HomeTable />
        </div>
    );
}

export default Home;
