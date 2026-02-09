import Articles from "./sections/Articles";
import Intro from "./sections/Intro";
import Partners from "./sections/Partners";
import Ressources from "./sections/Ressources";

// Page d'accueil composée de sections modulaires
const Home = () => {
  return (
    <>
      <Intro />
      <Partners />
      <Ressources />
      <Articles />
    </>
  );
};

export default Home;
