import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import InputForm from "./components/inputForm/inputForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <Router />
    
    <InputForm 
      placeholderText="email@email.com"
      inputId="email"
      labelTitle="Email"
      typeInput="text" />
    
    <InputForm 
      placeholderText=" "
      inputId="password"
      labelTitle="Senha"
      typeInput="password" />  
  </StrictMode>
);
