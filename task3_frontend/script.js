const api = "http://localhost:3000/users";

async function addUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    fetchUsers();
}

async function fetchUsers() {
    const res = await fetch(api);
    const users = await res.json();

    let output = "";

    users.forEach(user => {
        output += `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p>${user.email}</p>
        </div>`;
    });

    document.getElementById("userList").innerHTML = output;
}

fetchUsers();