import closeIconLight from "../../assets/close-icon-light.svg";
import addIcon from "../../assets/icon-add.svg";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.css";

export default function Filter({
  transactions,
  categoriesSelected,
  setTransactions,
  setTransactionsFiltered,
  setCategoriesSelected,
}) {
  const token = getItem("token");

  let path = "";

  function handleToggleCategory(categoryId) {
    const localCategories = [...categoriesSelected];

    const categoryUpdate = localCategories.filter((category) => {
      if (category.id === categoryId) {
        if (category.selected) {
          category.selected = false;
        } else {
          category.selected = true;
        }

        return category;
      }

      return category;
    });

    setCategoriesSelected(categoryUpdate);
  }

  async function handleApplyFilter() {
    const localCategories = [...categoriesSelected];

    path = "";

    const onlyCategoriesSelected = localCategories.filter((category) => {
      if (category.selected) {
        path += `filtro[]=${category.descricao}&`;
      }

      return category.selected;
    });

    if (onlyCategoriesSelected.length > 0) {
      try {
        const response = await api.get(
          `/transacao?${path.slice(0, path.length - 1)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length === 0) {
          return;
        } else {
          setTransactionsFiltered(response.data);
        }
      } catch (error) {
        return;
      }
    } else {
      setTransactionsFiltered([]);
      setTransactions(transactions);
      path = "";
    }
  }

  function handleClearAllFilters() {
    const localCategories = [...categoriesSelected];

    const clearSelect = localCategories.filter((category) => {
      if (category.selected) {
        category.selected = false;
        return category;
      }

      return category;
    });

    setCategoriesSelected(clearSelect);

    setTransactionsFiltered([]);
    setTransactions(transactions);
  }

  return (
    <div className="container-filter">
      <h3>Categoria</h3>
      <div className="container-categories">
        {categoriesSelected.map((category) => (
          <div
            key={category.id}
            className={category.selected ? "category selected" : "category"}
            onClick={() => handleToggleCategory(category.id)}
          >
            <p>{category.descricao}</p>
            {category.selected ? (
              <img src={closeIconLight} alt="Ícone de fechar" />
            ) : (
              <img src={addIcon} alt="Ícone de adição de categoria" />
            )}
          </div>
        ))}
      </div>
      <button className="button-clear" onClick={handleClearAllFilters}>
        Limpar Filtros
      </button>
      <button className="button-apply" onClick={handleApplyFilter}>
        Aplicar Filtros
      </button>
    </div>
  );
}
