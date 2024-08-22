import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

const Todo = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  return (
    <View>
      <Text>Todo List</Text>
      {todos.map((todo, index) => (
        <Text key={index}>{todo}</Text>
      ))}
      <TextInput
        value={newTodo}
        onChangeText={setNewTodo}
        placeholder="Enter a new todo"
      />
      <Button title="Add Todo" onPress={addTodo} />
    </View>
  );
};

export default Todo;
