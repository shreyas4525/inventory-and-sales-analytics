import { useState } from 'react';
import './App.css';
import Login from "./pages/auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from './pages/products';
import CreateProduct from './pages/createProduct';
import Navbar from './components/layout/Navbar';
import UpdateProduct from './pages/updateProduct';
import Cart from './pages/cart';
import Signup from './pages/auth/Signup';

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
        <Route path="/products/edit/:id" element={<UpdateProduct/>} />
        <Route path="/products/edit/:id" element={<UpdateProduct/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
