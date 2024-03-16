import {useEffect, useState} from "react";
import util, {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";

const ViewUserDashboard = () => {
    const navigate = useNavigate()
    const [client, setClient] = useState(null)

    const fetchUser = async () => {
        const user = getLocalUser()

        if (user.roles.includes('TRAINER')) {
            navigate("/trainer/dashboard")
            return
        }

        try {
            const response = await util.get(`http://localhost:8080/api/client/userid/${user.id}`)
            setClient(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPayments = async () => {
        // TODO:
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