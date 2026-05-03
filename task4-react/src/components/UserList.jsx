function UserList({ users, deleteUser,updateUser }) {
  if (users.length === 0) {
    return <p className="empty">No users found</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user._id} className="user-card">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <button
            className="delete-btn"
            onClick={() => deleteUser(user._id)}
          >
            Delete
          </button>
          <button onClick={() => updateUser(user._id)}>
          Edit
        </button>
        </div>
      ))}
    </div>
  );
}

export default UserList;