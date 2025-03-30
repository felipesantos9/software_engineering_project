import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage/loginPage";
import RegistrationPage from "./pages/registerPage/registerPage";
import UpdatePasswordPage from "./pages/updatePasswordPage/updatePasswordPage";


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/updatepassword" element={<UpdatePasswordPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;