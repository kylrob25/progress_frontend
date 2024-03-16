import {BrowserRouter, Route, Routes} from "react-router-dom";
import ViewUsers from "./pages/admin/ViewUsers";
import NoPage from "./pages/NoPage";
import Layout from "./pages/Layout";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ViewUser from "./pages/admin/ViewUser"
import Trainer from "./pages/trainer/ViewTrainer";
import ViewTrainers from "./pages/trainer/ViewTrainers";
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import ViewMessages from "./pages/user/ViewMessages";
import ViewDashboard from "./pages/trainer/ViewDashboard"
import ViewUserDashboard from "./pages/user/ViewDashboard";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<ViewTrainers/>}/>

                    <Route path="/admin/users" element={<ViewUsers/>}/>
                    <Route path="/admin/user/:userId" element={<ViewUser/>}/>
                    <Route path="/admin/user/create" element={<CreateUser/>}/>
                    <Route path="/admin/user/edit/:userId" element={<EditUser/>}/>

                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>

                    <Route path="/trainer/:username" element={<Trainer/>}/>

                    <Route path="/profile/messages" element={<ViewMessages/>}/>
                    <Route path="/profile/dashboard" element={<ViewUserDashboard/>}/>

                    <Route path="/trainer/dashboard" element={<ViewDashboard/>}/>

                    <Route path="*" element={<NoPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;