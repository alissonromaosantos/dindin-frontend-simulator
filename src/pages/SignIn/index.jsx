import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import FormSignIn from "../../components/FormSignIn";
import "./styles.css";

export default function SignIn() {
  return (
    <div className="container-login">
      <header>
        <img src={logo} alt="Logo do DinDin" />
      </header>
      <main>
        <div className="sign-up-area">
          <h1>
            Controle suas <strong>finanças</strong>, sem planilha chata.
          </h1>
          <p>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </p>
          <Link to="/sign-up" className="sign-up-button">
            Cadastre-se
          </Link>
        </div>
        <FormSignIn />
      </main>
    </div>
  );
}
