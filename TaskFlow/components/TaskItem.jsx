import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Phase 6: Presentational component — no Supabase, no local state
// Props:  item     { id, title, completed, created_at }
//         onToggle (item) => void   — called on tap
//         onDelete (id)   => void   — called on long press

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
      activeOpacity={0.7}
    >
      {/* Checkbox icon */}
      <MaterialIcons
        name={item.completed ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color="#2E5BBA"
      />

      {/* Task title */}
      <Text style={[styles.title, item.completed && styles.titleDone]}>
        {item.title}
      </Text>

      {/* Subtle drag handle hint */}
      <MaterialIcons name="drag-handle" size={20} color="#C8D0DC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
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
  title: {
    flex: 1,
    fontSize: 16,
    color: '#1F2A44',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#5A6472',
  },
});
