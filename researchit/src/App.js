import './App.css';
import {Route,Routes} from 'react-router-dom';
import Home from './pages/Home/Home';
import '@fontsource/inter/400.css'; 
import '@fontsource/inter/500.css'; 
import '@fontsource/inter/600.css'; 
import '@fontsource/inter/700.css';

function App() {
  return(
    <Routes>
    <Route path="/" element={<Home/>} />
    </Routes>
  );
}

export default App;
