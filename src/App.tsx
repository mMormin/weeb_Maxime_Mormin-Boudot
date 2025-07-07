import Header from "./components/layout/Header";
import { Outlet } from "react-router";
import "./App.css";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App;
