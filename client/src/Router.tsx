import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage/loginPage";
import RegistrationPage from "./pages/registerPage/registerPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<RegistrationPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;