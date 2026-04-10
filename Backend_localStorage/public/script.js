const form = document.getElementById("form");
const list = document.getElementById("list");

// Load users
async function loadUsers() {
  const res = await fetch("/users");
  const users = await res.json();

  list.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";

    div.innerHTML = `
      <div>
        <strong>${user.name}</strong><br>
        <small>${user.email}</small>
      </div>
      <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
    `;

    list.appendChild(div);
  });
}

// Add user
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  await fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  form.reset();
  loadUsers();
});

// Delete user
async function deleteUser(id) {
  await fetch(`/users/${id}`, { method: "DELETE" });
  loadUsers();
}

loadUsers();