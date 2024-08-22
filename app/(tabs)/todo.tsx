import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

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
        placeholder="新しく追加するTodo"
      />
      <Button title="追加" onPress={addTodo} />
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    // add your container styles here
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
