import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";

export default function FormSignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleChangeValue(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMessage("Por favor, preencha todos os campos!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("As senhas devem ser iguais!");
      return;
    }

    try {
      const response = await api.post("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });

      navigate("/sign-in");
    } catch (error) {
      setIsRegistered(false);
      console.log(error);
    }
  }

  return (
    <div className="container-form-signup">
      <h1>Cadastre-se</h1>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="form-inputs">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChangeValue}
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChangeValue}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChangeValue}
          />

          <label htmlFor="confirmPassword">Confirmação de senha</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChangeValue}
          />
        </div>

        {isRegistered ? (
          <span className="message">{message}</span>
        ) : (
          <span className="message error">{message}</span>
        )}

        <button type="submit">Cadastrar</button>
      </form>
      <span className="is-registered">
        Já tem cadastro?
        <Link to="/sign-in" className="link-to-sign-in">
          Clique aqui!
        </Link>
      </span>
    </div>
  );
}
