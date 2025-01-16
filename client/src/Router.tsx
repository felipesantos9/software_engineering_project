import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage/loginPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;