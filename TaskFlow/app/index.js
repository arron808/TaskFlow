import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';

// Phase 6: Componentization
// TaskItem      — presentational row, receives item / onToggle / onDelete
// AddTaskModal  — slide-up modal, receives visible / onClose / onSubmit

export default function HomeScreen() {
  // ── State ──────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);           // list of task objects
  const [modalVisible, setModalVisible] = useState(false); // controls Add Task modal

  // ── Load tasks on first render ─────────────────────────
  useEffect(() => {
    loadTasks();
  }, []);

  // ── READ ───────────────────────────────────────────────
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not load tasks', text2: error.message });
      return;
    }
    setTasks(data ?? []);
  }

  // ── CREATE ─────────────────────────────────────────────
  async function handleSubmitTask(title) {
    const { error } = await supabase
      .from('tasks')
      .insert([{ title, completed: false }]);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not add task', text2: error.message });
      return;
    }
    setModalVisible(false);
    await loadTasks();
    Toast.show({ type: 'success', text1: 'Task added' });
  }

  // ── UPDATE (toggle) ────────────────────────────────────
  async function handleToggleTask(item) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not update task', text2: error.message });
      return;
    }
    await loadTasks();
  }

  // ── DELETE ─────────────────────────────────────────────
  async function handleDeleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not delete task', text2: error.message });
      return;
    }
    await loadTasks();
    Toast.show({ type: 'success', text1: 'Task deleted' });
  }

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TaskFlow</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Task list ── */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="checklist" size={60} color="#C8D0DC" />
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubText}>Tap + to add your first task</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* ── Add Task Modal ── */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E5BBA',
    paddingTop: 56,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 6,
  },

  // Task rows — now handled by TaskItem component
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  // (taskRow, taskTitle, taskDone styles moved to components/TaskItem.jsx)

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A6472',
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0AABB',
  },
});
