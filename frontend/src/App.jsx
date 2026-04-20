import './App.css';
import Login from "./pages/auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from './pages/products';
import CreateProduct from './pages/createProduct';
import UpdateProduct from './pages/updateProduct';
import Cart from './pages/cart';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Sales from './pages/sales';

// 🔥 Auth check
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// 🔥 Protected Route
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

// 🔥 Public Route (Login/Signup)
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/products" /> : children;
};

function Layout() {
  return (
    <Routes>

      {/* 🔓 Public */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />

      {/* 🔒 Protected */}
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/products/create" 
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/products/edit/:id" 
        element={
          <ProtectedRoute>
            <UpdateProduct />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/sales" 
        element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        } 
      />

    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
