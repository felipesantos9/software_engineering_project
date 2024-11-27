import { BrowserRouter, Route, Routes } from "react-router";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello, World</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;