import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";


const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        token ? <Outlet/> : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth