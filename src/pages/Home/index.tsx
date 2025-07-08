import Articles from "./sections/Articles";
import Intro from "./sections/Intro";
import Partners from "./sections/Partners";
import Ressources from "./sections/Ressources";

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
