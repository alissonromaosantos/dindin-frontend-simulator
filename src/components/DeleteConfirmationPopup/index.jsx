import "../DeleteConfirmationPopup/styles.css";

export default function DeleteConfirmationPopup({
  deleteTransaction,
  currentTransactionId,
  setIsDeletePopupOpen,
  deletePopupPosition,
}) {
  return (
    <div className="delete-popup" style={deletePopupPosition}>
      <div>
        <p>Apagar item?</p>
      </div>
      <div className="btn-delete-options">
        <button
          className="btn-yes-delete"
          onClick={() => deleteTransaction(currentTransactionId)}
        >
          Sim
        </button>
        <button
          className="btn-no-delete"
          onClick={() => setIsDeletePopupOpen(false)}
        >
          Não
        </button>
      </div>
    </div>
  );
}
