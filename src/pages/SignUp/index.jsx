import "../SignUp/styles.css";
import logo from "../../assets/logo.svg";
import FormSignUp from "../../components/FormSignUp";

export default function SignUp() {
  return (
    <div className="container-signup">
      <header>
        <img src={logo} alt="Logo do DinDin" />
      </header>
      <div>
        <FormSignUp />
      </div>
    </div>
  );
}
