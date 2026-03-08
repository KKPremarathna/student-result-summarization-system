import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;