import { useState } from 'react';
import './App.css';
import Login from "./pages/auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from './pages/products';
import CreateProduct from './pages/createProduct';
import Navbar from './components/layout/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar/>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/create" element={<CreateProduct/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
