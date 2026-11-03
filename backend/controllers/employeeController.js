
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.EMPLOYEES_TABLE;

const getEmployees = async (req, res) => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    res.json(result.Items || []);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const newEmployee = {
      id: Date.now(),
      name,
      role,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newEmployee,
      })
    );

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Add employee error:", error);
    res.status(500).json({ message: "Failed to add employee" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role } = req.body;

    const existing = await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!existing.Item) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedEmployee = {
      ...existing.Item,
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
    };

    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: updatedEmployee,
      })
    );

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!existing.Item) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await dynamodb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    res.json({
      message: "Employee deleted successfully",
      employee: existing.Item,
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
