let employees = [
  { id: 1, name: "Riya Sharma", role: "Developer" },
  { id: 2, name: "Priya Rao", role: "Tester" },
];

const getEmployees = (req, res) => {
  res.json(employees);
};

const addEmployee = (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: "Name and role are required" });
  }

  const newEmployee = {
    id: Date.now(),
    name,
    role,
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
};

const updateEmployee = (req, res) => {
  const employee = employees.find((emp) => emp.id === Number(req.params.id));

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const { name, role } = req.body;
  if (name !== undefined) employee.name = name;
  if (role !== undefined) employee.role = role;

  res.json(employee);
};

const deleteEmployee = (req, res) => {
  const index = employees.findIndex((emp) => emp.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const deleted = employees.splice(index, 1);
  res.json({ message: "Employee deleted successfully", employee: deleted[0] });
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
