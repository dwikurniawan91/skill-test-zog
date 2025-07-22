import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./routes/home/HomePage"
import LoginPage from "./routes/auth/login/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
