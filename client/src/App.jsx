import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';
import EditPost from './components/EditPost';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext, { AuthProvider } from './context/AuthContext';
import './index.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AuraBlog</Link>
      <div className="nav-links">
        <Link to="/" className="btn btn-secondary">Home</Link>
        {user ? (
          <>
            <span style={{ alignSelf: 'center', marginRight: '10px' }}>Hi, {user.username}</span>
            <Link to="/create" className="btn">Write Post</Link>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
