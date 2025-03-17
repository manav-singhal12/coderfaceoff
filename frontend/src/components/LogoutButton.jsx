
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice.js";
import { toast } from 'react-toastify'

const LogoutButton = () => {
    // const { userInfo } = useSelector((state) => state.auth);
    // console.log(userInfo);
    const dispatch = useDispatch();
    const [logoutApiCall] = useLogoutMutation();

    const LogoutHandler = async () => {
        try {
            await logoutApiCall().unwrap(); // extracts the actual response from the action. for debugging purposes  else use then catch

            dispatch(logout());
            toast.success(" logout success")
        } catch (err) {
            console.log(err);
        }
    };

    return (<>
        <button onClick={LogoutHandler} className="flex items-center px-4 ">
            <span><strong>Logout</strong></span>
        </button>
    </>)
}

export default LogoutButton;