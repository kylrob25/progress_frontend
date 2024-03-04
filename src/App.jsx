import { BrowserRouter, Routes, Route} from "react-router-dom";
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

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ViewTrainers />} />

                    <Route path="/admin/view-users" element={<ViewUsers />} />
                    <Route path="/admin/view-user/:userId" element={<ViewUser />} />
                    <Route path="/admin/create-user" element={<CreateUser/>} />
                    <Route path="/admin/edit-user/:userId" element={<EditUser/>} />

                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />

                    <Route path="trainer/:username" element={<Trainer/>} />

                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;