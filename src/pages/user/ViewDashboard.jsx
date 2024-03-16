import {useEffect} from "react";
import {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";

const ViewUserDashboard = () => {
    const navigate = useNavigate()

    const fetchUser = async () => {
        const user = getLocalUser()

        if (user.roles.includes('TRAINER')) {
            navigate("/trainer/dashboard")
            return
        }

        try {
            // TODO:
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <>
            <h1>User Dashboard TODO</h1>
        </>
    )
}

export default ViewUserDashboard