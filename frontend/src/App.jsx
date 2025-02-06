import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Editor from './pages/Editor';
import Board from './pages/Board';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/editor/:docId' element={<Editor />} />
          <Route path='/board' element={<Board />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
