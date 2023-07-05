import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { setItem } from "../../utils/storage";
import "./styles.css";

export default function FormSignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChangeValue(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await api.post("/login", {
        email: form.email,
        senha: form.password,
      });

      const { token, usuario } = response.data;

      setItem("token", token);
      setItem("usuario", usuario.id);

      navigate("/");
    } catch (error) {
      setError(error.response.data.mensagem);
    }
  }

  return (
    <div className="container-form">
      <h3>Login</h3>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="container-inputs">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            id="email"
            onChange={handleChangeValue}
          />
        </div>
        <div className="container-inputs">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            id="password"
            onChange={handleChangeValue}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="sign-in-button" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}
