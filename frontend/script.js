const API_URL =
  "https://bzw1mh7pt5.execute-api.us-east-1.amazonaws.com/Prod/employees";

const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");

let editingEmployeeId = null;

async function getEmployees() {
  const response = await fetch(API_URL);
  const employees = await response.json();

  employeeList.innerHTML = "";

  employees.forEach((employee) => {
    const div = document.createElement("div");
    div.className = "employee";

    div.innerHTML = `
            <strong>${employee.name}</strong> - ${employee.role}
            <button onclick="editEmployee(${employee.id}, '${employee.name}', '${employee.role}')">Edit</button>
            <button onclick="deleteEmployee(${employee.id})">Delete</button>
        `;

    employeeList.appendChild(div);
  });
}

employeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;

  if (editingEmployeeId) {
    await fetch(`${API_URL}/${editingEmployeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });

    editingEmployeeId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });
  }

  employeeForm.reset();
  employeeForm.querySelector("button").textContent = "Add Employee";
  getEmployees();
});

function editEmployee(id, name, role) {
  editingEmployeeId = id;

  document.getElementById("name").value = name;
  document.getElementById("role").value = role;

  employeeForm.querySelector("button").textContent = "Update Employee";
}

async function deleteEmployee(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  getEmployees();
}

getEmployees();
