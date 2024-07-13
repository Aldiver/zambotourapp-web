import React, { ReactNode, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AuthenticatedLayout from './pages/AuthenticatedLayout';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Account from './pages/Account';
import Destinations from './pages/Destinations';
import AddUserForm from './components/AddUserForm';
import AddDestination from './pages/AddDestination';
import UserDetail from './pages/UserDetail';
import DestinationDetail from './pages/DestinationDetail';
import DestinationEdit from './pages/DestinationEdit';
import LandingPage from './pages/LandingPage';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="max-h-screen overflow-hidden">
      {currentUser ? children : <Navigate to="/home" />}
    </div>
  )
};

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AuthenticatedLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/add" element={<AddUserForm />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/add" element={<AddDestination />} />
            <Route path="destinations/:id" element={<DestinationDetail />} />
            <Route path="destinations/edit/:id" element={<DestinationEdit />} />
            <Route path="menu" element={<Menu />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
