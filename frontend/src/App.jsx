import { Outlet } from "react-router-dom";

//Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import Message from "./components/layout/Message";

//Context
import {UserProvider} from './context/userContext';

function App() {
  return (
    <UserProvider>
      <Navbar/>
      <Message/>
        <Container>
          <Outlet />
        </Container>
      <Footer/>
    </UserProvider>
  );
}
export default App;
