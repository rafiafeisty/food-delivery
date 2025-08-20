import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Cart from './components/Cart';
import Bill from './components/Bill';
import { useState, useEffect } from 'react';
import Navbar2 from './components/Navbar2';
import OrderStatus from './components/OrderStatus';
import Adminlogin from './components/Adminlogin'
import Orderchanging from './components/Orderchanging'


function App() {
  const [logged, setlogged] = useState(false);

  useEffect(() => {
    const savedLogged = localStorage.getItem("logged");
    if (savedLogged === "true") { 
      setlogged(true);
    }
  }, []);

  return (
    <Router>
      {logged ? <Navbar2 setlogged={setlogged} /> 
         : <Navbar setlogged={setlogged}/>}
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bill" element={<Bill/>} />
        <Route path="/orderstatus" element={<OrderStatus/>} />
        <Route path="/adminlog" element={<Adminlogin />} />
        <Route path="/orderchange" element={<Orderchanging />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
