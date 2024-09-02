import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";

export default function App() {
  const [task, setTask] = useState(""); // 新しいタスクまたは編集中のタスクのテキスト
  interface Task {
    id: string;
    text: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]); // タスクのリスト
  const [isEditing, setIsEditing] = useState<string | null>(null); // 現在編集中のタスクのID

  useEffect(() => {
    // アプリの初期化時にデータベースからタスクを読み込む
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:8010/todo");
      const dbTasks = await response.json();
      setTasks(
        dbTasks.map((t: any) => ({ id: t.id.toString(), text: t.title }))
      );
    };
    fetchTasks();
  }, []);

  const handleSaveTask = async () => {
    if (!task.trim()) return;
    if (isEditing) {
      // タスクを編集
      setTasks(
        tasks.map((t) => (t.id === isEditing ? { ...t, text: task } : t))
      );
      await fetch(`http://localhost:8010/todo/${isEditing}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task, completed: false }),
      });
      setIsEditing(null);
    } else {
      const response = await fetch("http://localhost:8010/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task }),
      });
      const newTask = await response.json();
      setTasks([...tasks, { id: newTask.id.toString(), text: newTask.title }]);
    }
    setTask("");
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    await fetch(`http://localhost:8010/todo/${id}`, {
      method: "DELETE",
    });
  };

  const handleEditTask = (task: Task) => {
    setTask(task.text);
    setIsEditing(task.id);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.task}>
      <Text style={styles.taskText}>{item.text}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTask(item)}
        >
          <Icon name="edit" type="material" color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Icon name="delete" type="material" color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDoアプリ</Text>
      <TextInput
        placeholder="タスクを入力"
        style={styles.input}
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <Text style={styles.saveButtonText}>{isEditing ? "更新" : "追加"}</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccceee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  deleteButton: {
    marginLeft: 4,
  },
  editButton: {
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#eeeeee",
    borderRadius: 5,
  },
  taskText: {
    maxWidth: "80%",
  },
  deleteButtonText: {
    color: "#dc3545",
  },
});
