import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

// Phase 5: Supabase CRUD
// loadTasks   — SELECT all tasks ordered by created_at DESC
// handleSubmitTask  — INSERT a new task row
// handleToggleTask  — UPDATE completed flag on a task
// handleDeleteTask  — DELETE a task by id
// Always check { error } before trusting { data }

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
          // Tap = toggle | Long press = delete
          <TouchableOpacity
            style={styles.taskRow}
            onPress={() => handleToggleTask(item)}
            onLongPress={() => handleDeleteTask(item.id)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={item.completed ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color="#2E5BBA"
            />
            <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
              {item.title}
            </Text>
            <MaterialIcons name="drag-handle" size={20} color="#C8D0DC" />
          </TouchableOpacity>
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

  // Task rows
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    color: '#1F2A44',
    flex: 1,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#5A6472',
  },

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
