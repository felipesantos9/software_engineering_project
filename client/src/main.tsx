import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import InputForm from "./components/inputForm/inputForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
    <InputForm />
  </StrictMode>
);
