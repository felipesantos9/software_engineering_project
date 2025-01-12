import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import InputForm from "./components/inputForm/inputForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <Router />
    <InputForm 
      placeholderText="email@email.com"
      id="email"
      labelTitle="Email"
      typeInput="text" />
    <InputForm 
      placeholderText=" "
      id="password"
      labelTitle="Senha"
      typeInput="password" />  
  </StrictMode>
);
