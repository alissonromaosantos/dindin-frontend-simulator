import "./styles.css";
import api from "../../services/api";
import { useState, useEffect } from "react";
import closeIcon from "../../assets/close-icon.svg";
import { getItem } from "../../utils/storage";

export default function EditUserProfile({
  setIsModalOpen,
  userName,
  userEmail,
  updateProfileInfo,
}) {
  const token = getItem("token");

  const [editedUserName, setEditedUserName] = useState("");
  const [editedUserEmail, setEditedUserEmail] = useState("");

  const [modalError, setModalError] = useState("");

  useEffect(() => {
    setEditedUserName(userName);
    setEditedUserEmail(userEmail);
  }, [userName, userEmail]);

  const [form, setForm] = useState({
    name: userName,
    email: userEmail,
    password: "",
    confirmPassword: "",
  });

  function handleChangeForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setModalError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setModalError("Por favor, preencha todos os campos!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setModalError("As senhas devem ser iguais!");
    }

    try {
      const response = await api.put(
        "/usuario",
        {
          nome: editedUserName,
          email: editedUserEmail,
          senha: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      updateProfileInfo(editedUserName, editedUserEmail);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container-edit-profile">
      <div className="modal">
        <img
          src={closeIcon}
          alt="Botão para fechar modal"
          onClick={() => setIsModalOpen(false)}
        />
        <h1>Editar Perfil</h1>
        <form method="PUT" onSubmit={handleSubmit}>
          <label className="top-42" htmlFor="name">
            Nome
          </label>
          <input
            type="text"
            value={editedUserName}
            name="name"
            id="name"
            onChange={(e) => setEditedUserName(e.target.value)}
          />
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            value={editedUserEmail}
            name="email"
            id="email"
            onChange={(e) => setEditedUserEmail(e.target.value)}
          />
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            value={form.password}
            name="password"
            id="password"
            onChange={handleChangeForm}
          />
          <label htmlFor="confirmPassword">Confirmação de senha</label>
          <input
            type="password"
            value={form.confirmPassword}
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChangeForm}
          />
          {modalError && <p className="error-message">{modalError}</p>}
          <button className="button-submit" type="submit">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
