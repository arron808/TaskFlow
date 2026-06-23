import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Phase 4: State and Hooks
// useState manages local task data and modal visibility
// useEffect runs loadTasks once when the screen first mounts
// Phase 5 will replace the mock data with real Supabase calls

// Mock tasks — shape matches the Supabase row: { id, title, completed, created_at }
const MOCK_TASKS = [
  { id: '1', title: 'Buy groceries', completed: false, created_at: new Date().toISOString() },
  { id: '2', title: 'Read chapter 3', completed: true, created_at: new Date().toISOString() },
  { id: '3', title: 'Submit assignment', completed: false, created_at: new Date().toISOString() },
];

export default function HomeScreen() {
  // ── State ──────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);           // list of task objects
  const [modalVisible, setModalVisible] = useState(false); // controls Add Task modal

  // ── Load tasks on first render ─────────────────────────
  useEffect(() => {
    loadTasks();
  }, []);

  // Phase 4: local mock — Phase 5 replaces this with Supabase
  function loadTasks() {
    setTasks(MOCK_TASKS);
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
          <View style={styles.taskRow}>
            <MaterialIcons
              name={item.completed ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color="#2E5BBA"
            />
            <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
              {item.title}
            </Text>
          </View>
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
