const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { title } = req.body;
  const newTodo = await prisma.todo.create({
    data: { title, completed: false },
  });
  res.json(newTodo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updatedTodo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { title, completed },
  });
  res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
