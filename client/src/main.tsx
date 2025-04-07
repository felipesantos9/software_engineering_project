import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserProvider from "./context/login.tsx";
import { CookiesProvider } from "react-cookie";
import Router from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
    <UserProvider>
     <Router /> 
    </UserProvider>
    </CookiesProvider>
  </StrictMode>
);
