import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage/loginPage";
import RegistrationPage from "./pages/registerPage/registerPage";
import UpdatePasswordPage from "./pages/updatePasswordPage/updatePasswordPage";
import ForgotPasswordPage from "./pages/forgotPasswordPages/forgotPasswordPage";
import HomeScreenPage from "./pages/homeScreenPage/homeScreenPage";
import TripsRegisterPage from "./pages/tripsRegisterPage/tripsRegisterPage";
import TripsPage from "./pages/tripsPage/tripsPage";


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/updatepassword" element={<UpdatePasswordPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/" element={<HomeScreenPage />} />
        <Route path="/trips/register" element={<TripsRegisterPage />} />
        <Route path="/trips" element={<TripsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;