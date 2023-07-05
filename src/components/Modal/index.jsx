import { useEffect, useState } from "react";
import closeIcon from "../../assets/close-icon.svg";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.css";

export default function Modal({
  transactions,
  setTransactions,
  setIsModalOpen,
}) {
  const token = getItem("token");

  const [isTransactionExitSelected, setIsTransactionExitSelected] =
    useState(true);
  const [isTransactionEntrySelected, setIsTransactionEntrySelected] =
    useState(false);

  const [form, setForm] = useState({
    transaction: "saida",
    value: 0,
    idCategory: 0,
    date: "",
    description: "",
  });

  const [modalError, setModalError] = useState("");

  const [categories, setCategories] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    setModalError("");

    if (
      !form.transaction ||
      !form.value ||
      !form.idCategory ||
      !form.date ||
      !form.description
    ) {
      setModalError("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await api.post(
        "/transacao",
        {
          tipo: form.transaction,
          descricao: form.description,
          valor: form.value * 100,
          data: form.date,
          categoria_id: form.idCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;

      setTransactions([...transactions, data]);

      setIsModalOpen(false);
    } catch (error) {
      setModalError(error.response.data.mensagem);
    }
  }

  function handleChangeForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleChangeEntrySelection() {
    setIsTransactionEntrySelected(true);
    setIsTransactionExitSelected(false);

    setForm({ ...form, transaction: "entrada" });
  }

  function handleChangeExitSelection() {
    setIsTransactionExitSelected(true);
    setIsTransactionEntrySelected(false);

    setForm({ ...form, transaction: "saida" });
  }

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get("/categoria", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data);
      } catch (error) {
        setModalError(error.response.data.mensagem);
      }
    }

    getCategories();
  }, []);

  return (
    <div className="container-modal">
      <div className="modal">
        <img
          src={closeIcon}
          alt="Botão para fechar modal"
          onClick={() => setIsModalOpen(false)}
        />
        <h1>Adicionar Registro</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="transaction-info">
            <button
              type="button"
              className={isTransactionEntrySelected ? "selected" : "disabled"}
              onClick={handleChangeEntrySelection}
            >
              Entrada
            </button>
            <button
              type="button"
              className={
                isTransactionExitSelected ? "selected-exit" : "disabled"
              }
              onClick={handleChangeExitSelection}
            >
              Saída
            </button>
          </div>
          <label className="top-42" htmlFor="value">
            Valor
          </label>
          <input
            type="text"
            value={form.value}
            name="value"
            id="value"
            onChange={handleChangeForm}
          />
          <label htmlFor="category">Categoria</label>
          <select
            value={form.idCategory}
            name="idCategory"
            id="category"
            onChange={handleChangeForm}
          >
            <option value={0} disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.descricao}
              </option>
            ))}
          </select>
          <label htmlFor="date">Data</label>
          <input
            type="date"
            value={form.date}
            name="date"
            id="date"
            onChange={handleChangeForm}
          />
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            value={form.description}
            name="description"
            id="description"
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
