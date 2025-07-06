export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx._id}>
          ₹{tx.amount} - {tx.description} ({new Date(tx.date).toLocaleDateString()})
          <button onClick={() => onEdit(tx)}>Edit</button>
          <button onClick={() => onDelete(tx._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
