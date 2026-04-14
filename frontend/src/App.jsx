import './App.css';
import Login from "./pages/auth/Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Products from './pages/products';
import CreateProduct from './pages/createProduct';
import Navbar from './components/layout/Navbar';
import UpdateProduct from './pages/updateProduct';
import Cart from './pages/cart';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';

// ✅ Layout component (IMPORTANT)
function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Show Navbar only if NOT dashboard */}
      {location.pathname !== "/dashboard" && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/edit/:id" element={<UpdateProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

// ✅ Main App
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
