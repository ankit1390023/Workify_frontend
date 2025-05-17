import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const { user } = useSelector(store => store.auth)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true })
        } else if (location.pathname.startsWith('/admin') && user.role !== 'recruiter') {
            navigate('/', { replace: true })
        }
    }, [user, location.pathname, navigate])

    if (!user) {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute