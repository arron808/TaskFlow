import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';

// Phase 6: Modal component — no Supabase, no task state
// Props:  visible   boolean         — controls modal visibility
//         onClose   ()     => void  — close without saving
//         onSubmit  (title)=> void  — save new task title

export default function AddTaskModal({ visible, onClose, onSubmit }) {
  const [text, setText] = useState('');

  function handleAdd() {
    if (!text.trim()) return;   // ignore empty input
    onSubmit(text.trim());
    setText('');                // reset field after submit
  }

  function handleClose() {
    setText('');                // clear on cancel too
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}   // Android back button
    >
      {/* Semi-transparent dark backdrop — tap outside to close */}
      <Pressable style={styles.backdrop} onPress={handleClose}>

        {/* Card — inner Pressable stops tap from bubbling to backdrop */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.heading}>New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="#A0AABB"
            value={text}
            onChangeText={setText}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addBtn, !text.trim() && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!text.trim()}
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </Pressable>

      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Full-screen dark overlay
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',  // slide up from bottom
  },

  // White rounded card
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2A44',
    marginBottom: 4,
  },

  // Text input
  input: {
    borderWidth: 1.5,
    borderColor: '#DDE3EF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2A44',
    backgroundColor: '#F4F6FB',
  },

  // Button row
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DDE3EF',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5A6472',
  },
  addBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E5BBA',
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#A8BADA',
  },
  addText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
