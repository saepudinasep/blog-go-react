import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './page/Home';
import BlogList from './page/BlogList';
import BlogDetail from './page/BlogDetail';
import About from './page/About';
import Contact from './page/Contact';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog' element={<BlogList />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
