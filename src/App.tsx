import Header from "./components/layout/Header";
import { Outlet, useLocation } from "react-router";
import "./index.css";
import Footer from "./components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { routeMetas } from "./utils/routeMetas";

function App() {
  const location = useLocation();
  const meta = routeMetas[location.pathname];

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <div className="font-roboto bg-primary">
        <Header />

        <main className="bg-primary ">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
