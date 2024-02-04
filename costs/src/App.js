import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/pages/Home';
import Company from './components/pages/Company';
import Contact from './components/pages/Contact';
import NewProject from './components/pages/NovoProjeto';
import Container from './components/layout/Container';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Projects from './components/pages/Projects';
import Project from './components/pages/Project';

function App() {
  return (
    //Comando Router: Componente de criação de navegação entre as telas
    //Link: Para fazer a linkagem entre as páginas
    //Routes define as rotas em que poderam ser acessadas
    //Route a rota em que vai ser acessada(a rota em que é criada)
    <Router>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route path='/company' element={<Company />}></Route>
          <Route path='/projects' element={<Projects />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/newproject' element={<NewProject />}></Route>
          <Route path='/project/:id' element={<Project />}></Route>
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
