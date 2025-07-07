import Header from "./components/layout/Header";
import { Outlet } from "react-router";
import "./index.css";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="font-roboto">
      <Header />

      <main className="bg-primary">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
