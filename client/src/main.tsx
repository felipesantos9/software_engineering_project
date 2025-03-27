import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserProvider from "./context/login.tsx";
import Router from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
     <Router /> 
    </UserProvider>
  </StrictMode>
);
