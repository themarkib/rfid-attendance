import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // console.log(token);

        if (token) {
            // Optionally verify the token with your backend here
            setIsAuthenticated(true);
        } else {
            navigate('/admin'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/admin');
    };

    return { isAuthenticated, logout };
};

export default useAuth;
