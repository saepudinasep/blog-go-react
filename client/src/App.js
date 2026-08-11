import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './page/Home';
import BlogList from './page/BlogList';
import BlogDetail from './page/BlogDetail';
import CreateBlog from './page/CreateBlog';
import UpdateBlog from './page/UpdateBlog';
import About from './page/About';
import Contact from './page/Contact';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path='/' element={<Home />} />

        {/* Blog */}
        <Route path='/blog' element={<BlogList />} />

        {/* Create Blog */}
        <Route path='/blog/create' element={<CreateBlog />} />

        {/* Update Blog */}
        <Route path='/blog/edit/:id' element={<UpdateBlog />} />

        {/* Blog Detail */}
        <Route path='/blog/:id' element={<BlogDetail />} />

        {/* Other Pages */}
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
