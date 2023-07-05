import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import deleteIcon from "../../assets/delete-icon.png";
import editIcon from "../../assets/edit-icon.png";
import filterIcon from "../../assets/filter-icon.png";
import logo from "../../assets/logo.svg";
import iconDown from "../../assets/order-icon-down.png";
import iconUp from "../../assets/order-icon-up.png";
import signOutLogo from "../../assets/sign-out-logo.png";
import userProfile from "../../assets/user-profile.png";
import Filter from "../../components/Filter";
import Modal from "../../components/Modal";
import api from "../../services/api";
import { getItem, removeItem } from "../../utils/storage";
import "./styles.css";
import EditModal from "../../components/EditModal";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import { useNavigate } from "react-router-dom";
import EditUserProfile from "../../components/EditUserProfile";

export default function Main() {
  const token = getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [transactionsFiltered, setTransactionsFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderIconDown, setOrderIconDown] = useState(false);
  const [isFilterActived, setIsFilterActived] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deletePopupPosition, setDeletePopupPosition] = useState({
    left: 0,
    top: 0,
  });
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditUserProfileOpen, setIsEditUserProfileOpen] = useState(false);
  const [userProfileInfo, setUserProfileInfo] = useState({});

  const navigate = useNavigate();

  function handleOrderTable(typeOrder, order) {
    if (typeOrder === "date" && order === "asc") {
      if (transactionsFiltered.length === 0) {
        const localTransactions = [...transactions];
        const orderlyForDateAsc = localTransactions.toSorted((a, b) => {
          return new Date(a.data) - new Date(b.data);
        });

        setTransactions([...orderlyForDateAsc]);
      } else {
        const localTransactionsFiltered = [...transactionsFiltered];
        const orderlyForDateAscFiltered = localTransactionsFiltered.toSorted(
          (a, b) => {
            return new Date(a.data) - new Date(b.data);
          }
        );

        setTransactionsFiltered([...orderlyForDateAscFiltered]);
      }
    } else {
      if (transactionsFiltered.length === 0) {
        const localTransactions = [...transactions];
        const orderlyForDateDesc = localTransactions.toSorted((a, b) => {
          return new Date(b.data) - new Date(a.data);
        });

        setTransactions([...orderlyForDateDesc]);
      } else {
        const localTransactionsFiltered = [...transactionsFiltered];
        const orderlyForDateDescFiltered = localTransactionsFiltered.toSorted(
          (a, b) => {
            return new Date(b.data) - new Date(a.data);
          }
        );

        setTransactionsFiltered([...orderlyForDateDescFiltered]);
      }
    }
  }

  useEffect(() => {
    async function getTransactions() {
      const response = await api.get("/transacao", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;

      setTransactions(data);
    }

    getTransactions();

    async function getCategories() {
      try {
        const response = await api.get("/categoria", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setCategories(data);
        setCategoriesSelected(data);
      } catch (error) {
        setModalError(error.response.data.mensagem);
      }
    }

    getCategories();
  }, []);

  useEffect(() => {
    async function getExtract() {
      try {
        const response = await api.get("/transacao/extrato", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;

        setTransactionSummary(data);
      } catch (error) {
        return;
      }
    }

    getExtract();
  }, [transactions]);

  const openEditModal = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditModalOpen(true);
  };

  async function deleteTransaction(id) {
    try {
      await api.delete(`/transacao/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );

      setIsDeletePopupOpen(false);
    } catch (error) {
      return;
    }
  }

  const openDeleteConfirmation = (id, event) => {
    const deleteButton = event.target;
    const deleteButtonRect = deleteButton.getBoundingClientRect();

    const leftPosition = deleteButtonRect.left;
    const topPosition = deleteButtonRect.top;

    setCurrentTransactionId(id);
    setIsDeletePopupOpen(true);
    setDeletePopupPosition({
      left: `${leftPosition}px`,
      top: `${topPosition}px`,
    });

    event.stopPropagation();
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await api.get("/usuario", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { nome: username, email } = response.data;

        setUserProfileInfo({ username, email });
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, [token]);

  const handleSignOut = () => {
    removeItem("token");
    removeItem("usuario");

    navigate("/sign-in");
  };

  const handleEditProfile = () => {
    setIsEditUserProfileOpen(true);
  };

  useEffect(() => {
    setUserName(userProfileInfo.username);
    setUserEmail(userProfileInfo.email);
  }, [userProfileInfo]);

  const updateProfileInfo = (username, email) => {
    setUserName(username);
    setUserEmail(email);
  };

  return (
    <div className="container-main">
      <div className="header">
        <div>
          <img className="logo-dindin" src={logo} alt="Logo DinDin" />
        </div>
        <div className="user-area">
          <img
            className="user-profile-img"
            src={userProfile}
            alt="Imagem de perfil"
            onClick={handleEditProfile}
          />
          <strong>{userName}</strong>
          <img
            className="logo-signout"
            src={signOutLogo}
            alt="Logo de Sign-Out"
            onClick={handleSignOut}
          />
        </div>
      </div>
      <div className="main">
        <div className="area-main">
          <div
            className="btn-filter"
            onClick={() => setIsFilterActived(!isFilterActived)}
          >
            <img src={filterIcon} alt="Ícone de filtrar" />
            <span>Filtrar</span>
          </div>
          {isFilterActived && (
            <div className="filter-area">
              <Filter
                transactions={transactions}
                categoriesSelected={categoriesSelected}
                setTransactions={setTransactions}
                setTransactionsFiltered={setTransactionsFiltered}
                setCategoriesSelected={setCategoriesSelected}
              />
              <div className="area-right">
                <div className="area-resumo">
                  <h1>Resumo</h1>
                  <div className="entradas">
                    <h4>Entradas</h4>
                    <span className="valor">
                      {(transactionSummary.entrada / 100).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )}
                    </span>
                  </div>
                  <div className="saidas">
                    <h4>Saídas</h4>
                    <span className="valor">
                      {(transactionSummary.saida / 100).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className="saldo">
                    <strong>Saldo</strong>
                    <span className="valor">
                      {(
                        transactionSummary.entrada / 100 -
                        transactionSummary.saida / 100
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  className="add-register"
                  onClick={() => setIsModalOpen(true)}
                >
                  Adicionar Registro
                </button>
              </div>
            </div>
          )}
          <div className="main-div">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="column-header">
                      Data
                      <div
                        className="order-icon"
                        onClick={() => setOrderIconDown(!orderIconDown)}
                      >
                        {orderIconDown ? (
                          <img
                            onClick={() => handleOrderTable("date", "desc")}
                            src={iconDown}
                            alt="Ícone de ordenação descrescente"
                          />
                        ) : (
                          <img
                            onClick={() => handleOrderTable("date", "asc")}
                            src={iconUp}
                            alt="Ícone de ordenação cresecente"
                          />
                        )}
                      </div>
                    </div>
                  </th>
                  <th>Dia da Semana</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactionsFiltered.length === 0
                  ? transactions.map((transaction) => (
                      <tr className="transacao" key={transaction.id}>
                        <td className="cell td-data">
                          {format(
                            parseISO(transaction.data.slice(0, 10)),
                            "dd/MM/yyyy"
                          )}
                        </td>
                        <td className="cell">
                          {format(
                            parseISO(transaction.data.slice(0, 10)),
                            "EEEE",
                            { locale: ptBR }
                          ).includes("feira")
                            ? format(
                                parseISO(transaction.data.slice(0, 10)),
                                "EEEE",
                                { locale: ptBR }
                              )
                                .slice(0, -6)
                                .replaceAll("segunda", "Segunda")
                                .replaceAll("terça", "Terça")
                                .replaceAll("quarta", "Quarta")
                                .replaceAll("quinta", "Quinta")
                                .replaceAll("sexta", "Sexta")
                            : format(
                                parseISO(transaction.data.slice(0, 10)),
                                "EEEE",
                                { locale: ptBR }
                              )
                                .replaceAll("sábado", "Sábado")
                                .replaceAll("domingo", "Domingo")}
                        </td>
                        <td className="cell">{transaction.descricao}</td>
                        <td className="cell">{transaction.categoria_nome}</td>
                        <td
                          className={
                            transaction.tipo === "saida"
                              ? "exit-color bold cell"
                              : "entry-color bold cell"
                          }
                        >
                          {(transaction.valor / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="icons-table cell">
                          <img
                            src={editIcon}
                            alt="Ícone de editar"
                            onClick={() => openEditModal(transaction)}
                          />
                          <img
                            src={deleteIcon}
                            alt="Ícone de deletar"
                            onClick={(event) =>
                              openDeleteConfirmation(transaction.id, event)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  : transactionsFiltered.map((transaction) => (
                      <tr className="transacao" key={transaction.id}>
                        <td className="td-data">
                          {format(
                            new Date(transaction.data.slice(0, 10)),
                            "dd/MM/yyyy"
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(transaction.data.slice(0, 10)),
                            "EEEE",
                            { locale: ptBR }
                          ).includes("feira")
                            ? format(
                                new Date(transaction.data.slice(0, 10)),
                                "EEEE",
                                { locale: ptBR }
                              )
                                .slice(0, -6)
                                .replaceAll("segunda", "Segunda")
                                .replaceAll("terça", "Terça")
                                .replaceAll("quarta", "Quarta")
                                .replaceAll("quinta", "Quinta")
                                .replaceAll("sexta", "Sexta")
                            : format(
                                new Date(transaction.data.slice(0, 10)),
                                "EEEE",
                                { locale: ptBR }
                              )
                                .replaceAll("sábado", "Sábado")
                                .replaceAll("domingo", "Domingo")}
                        </td>
                        <td>{transaction.descricao}</td>
                        <td>{transaction.categoria_nome}</td>
                        <td
                          className={
                            transaction.tipo === "saida"
                              ? "exit-color bold"
                              : "entry-color bold"
                          }
                        >
                          {(transaction.valor / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="icons-table">
                          <img src={editIcon} alt="Ícone de editar" />
                          <img src={deleteIcon} alt="Ícone de deletar" />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!isFilterActived && (
              <div className="area-right">
                <div className="area-resumo">
                  <h1>Resumo</h1>
                  <div className="entradas">
                    <h4>Entradas</h4>
                    <span className="valor">
                      {(transactionSummary.entrada / 100).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )}
                    </span>
                  </div>
                  <div className="saidas">
                    <h4>Saídas</h4>
                    <span className="valor">
                      {(transactionSummary.saida / 100).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className="saldo">
                    <strong>Saldo</strong>
                    <span className="valor">
                      {(
                        transactionSummary.entrada / 100 -
                        transactionSummary.saida / 100
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  className="add-register"
                  onClick={() => setIsModalOpen(true)}
                >
                  Adicionar Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          transactions={transactions}
          setTransactions={setTransactions}
          setTransactioSummary={setTransactionSummary}
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          setIsModalOpen={setIsEditModalOpen}
          transactions={transactions}
          setTransactions={setTransactions}
          setTransactioSummary={setTransactionSummary}
          currentTransaction={currentTransaction}
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {isDeletePopupOpen && (
        <DeleteConfirmationPopup
          setIsDeletePopupOpen={setIsDeletePopupOpen}
          deleteTransaction={deleteTransaction}
          currentTransactionId={currentTransactionId}
          deletePopupPosition={deletePopupPosition}
        />
      )}
      {isEditUserProfileOpen && (
        <EditUserProfile
          setIsModalOpen={setIsEditUserProfileOpen}
          userName={userName}
          userEmail={userEmail}
          userProfileInfo={userProfileInfo}
          updateProfileInfo={updateProfileInfo}
        />
      )}
    </div>
  );
}
