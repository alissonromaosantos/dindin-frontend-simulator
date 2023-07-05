import { useEffect, useState } from "react";
import closeIcon from "../../assets/close-icon.svg";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.css";

export default function EditModal({
  setIsModalOpen,
  currentTransaction,
  transactions,
  setTransactions,
}) {
  const token = getItem("token");
  const [modalError, setModalError] = useState("");
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    id: currentTransaction.id,
    transaction: currentTransaction.tipo,
    value: (currentTransaction.valor / 100).toFixed(2),
    idCategory: currentTransaction.categoria_id,
    nameCategory: currentTransaction.categoria_nome,
    date: currentTransaction.data.slice(0, 10),
    description: currentTransaction.descricao,
  });

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

  function handleChangeForm(e) {
    const { name, value } = e.target;

    if (name === "nameCategory") {
      const selectedCategory = categories.find(
        (category) => category.descricao === value
      );
      setForm({ ...form, [name]: value, idCategory: selectedCategory.id });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setModalError("");

    if (
      !form.transaction ||
      !form.value ||
      !form.idCategory ||
      !form.nameCategory ||
      !form.date ||
      !form.description
    ) {
      setModalError("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await api.put(
        `/transacao/${currentTransaction.id}`,
        {
          tipo: form.transaction,
          valor: form.value * 100,
          categoria_id: form.idCategory,
          categoria_nome: form.nameCategory,
          data: form.date,
          descricao: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTransactions = transactions.map((transactions) => {
        if (transactions.id === currentTransaction.id) {
          return {
            ...transactions,
            tipo: form.transaction,
            valor: form.value * 100,
            categoria_id: form.idCategory,
            categoria_nome: form.nameCategory,
            data: form.date,
            descricao: form.description,
          };
        }
        return transactions;
      });

      setTransactions(updatedTransactions);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container-modal">
      <div className="modal">
        <img
          src={closeIcon}
          alt="Botão para fechar modal"
          onClick={() => setIsModalOpen(false)}
        />
        <h1>Editar Registro</h1>
        <form method="PUT" onSubmit={handleSubmit}>
          <div className="transaction-info">
            <button
              type="button"
              className={
                form.transaction === "entrada" ? "selected" : "disabled"
              }
              onClick={() => setForm({ ...form, transaction: "entrada" })}
            >
              Entrada
            </button>
            <button
              type="button"
              className={
                form.transaction === "saida" ? "selected-exit" : "disabled"
              }
              onClick={() => setForm({ ...form, transaction: "saida" })}
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
            value={form.nameCategory}
            name="nameCategory"
            id="nameCategory"
            onChange={handleChangeForm}
          >
            <option value={0} disabled>
              Selecione uma opção
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.descricao}>
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
        <div className="modal-buttons"></div>
      </div>
    </div>
  );
}
