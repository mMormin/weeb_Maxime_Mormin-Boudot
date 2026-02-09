import ContactForm from "../../components/form/ContactForm";

// Page de contact avec formulaire
const Contact = () => {
  return (
    <section className="text-white py-10 pt-40 px-10 xl:px-0">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Titre */}
        <h2 className="text-large font-extrabold tracking-wide leading-20">
          Votre avis compte !
        </h2>

        {/* Description */}
        <p className="text-xl leading-8 tracking-wide my-10">
          Votre retour est essentiel pour nous améliorer ! Partagez votre
          expérience, dites-nous ce que vous aimez et ce que nous pourrions
          améliorer. Vos suggestions nous aident à faire de ce blog une
          ressource toujours plus utile et enrichissante.
        </p>

        {/* Formulaire de contact */}
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
