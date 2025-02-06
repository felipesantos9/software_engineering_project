import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage/loginPage";
import RegistrationPage from "./pages/registrationPage/registrationPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;