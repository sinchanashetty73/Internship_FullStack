function UserList({ users, deleteUser }) {
  if (users.length === 0) {
    return <p className="empty">No users found</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <button
            className="delete-btn"
            onClick={() => deleteUser(user.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default UserList;