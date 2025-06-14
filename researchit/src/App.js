import './App.css';
import {Route,Routes} from 'react-router-dom';
import Home from './pages/Home/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import '@fontsource/inter/400.css'; 
import '@fontsource/inter/500.css'; 
import '@fontsource/inter/600.css'; 
import '@fontsource/inter/700.css';

function App() {
  return(
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;
