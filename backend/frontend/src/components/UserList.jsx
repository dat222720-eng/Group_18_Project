export default function UserList({ items = [], onRemove }) {
  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr><th>Email</th><th>Name</th><th>Role</th><th></th></tr>
      </thead>
      <tbody>
        {items.map(u => (
          <tr key={u._id}>
            <td>{u.email}</td>
            <td>{u.name}</td>
            <td>{u.role}</td>
            <td><button onClick={() => onRemove?.(u._id)}>Xoá</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
