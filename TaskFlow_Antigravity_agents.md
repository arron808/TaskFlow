# TaskFlow Antigravity Project Instructions

Use this file as the project guidance for Antigravity when working in this folder. The goal is to build **TaskFlow**, a beginner-friendly Expo React Native mobile to-do app backed by Supabase.

## Source guide

This project follows the uploaded guide: **IT331_LA1.2_TaskFlow_Follow_Along_Guide.pdf**. Keep the implementation aligned with its seven phases:

1. Environment Setup
2. Supabase Setup
3. React Native UI Fundamentals
4. State and Hooks
5. Supabase CRUD
6. Componentization
7. Navigation, Modals, and Notifications

## Final target

Build a polished mobile to-do list app with:

- Expo React Native project structure.
- Supabase `tasks` table as the cloud database.
- Full CRUD: create, read, update/toggle, and delete tasks.
- `FlatList` for rendering tasks.
- Material Icons from `@expo/vector-icons`.
- Componentized UI files.
- Expo Router app structure.
- Modal-based add-task flow.
- Toast confirmations for add/delete/error feedback.
- Expo Go compatibility for phone testing.

## Operating rules for the agent

- Work only inside the current project folder unless the user explicitly says otherwise.
- Prefer simple JavaScript/JSX, not TypeScript, unless the existing project is already TypeScript.
- Keep the code beginner-readable and close to the course guide.
- Do not invent real Supabase credentials. Use placeholders and tell the user where to paste their values.
- Do not remove existing user code without checking whether it is still needed.
- Use `npx expo install` for Expo-compatible dependencies.
- Always check Supabase responses for `{ error }` before trusting `data`.
- Do not put Supabase logic inside presentational components.
- Keep task data shaped like the Supabase row: `{ id, title, completed, created_at }`.
- Use immutable state updates when local state is involved.
- After changes, run or suggest the relevant verification command.

## Recommended commands

Use these commands when setting up from a blank folder:

```bash
npx create-expo-app TaskFlow
cd TaskFlow
npx expo start
```

Install project dependencies:

```bash
npx expo install @supabase/supabase-js
npx expo install @expo/vector-icons
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install react-native-toast-message
```

Verify basic tooling:

```bash
node -v
npm -v
npx expo start
```

## Supabase setup requirements

Create a Supabase project named `TaskFlow` and a table named `tasks`.

Required columns:

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `title` | `text` | Task title |
| `completed` | `boolean` | Default `false` |
| `created_at` | `timestamp` | Default `now()` |

For this beginner demo, Row Level Security may be disabled temporarily. For production, add RLS policies.

Create `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

Replace the placeholders with the user's Supabase Project URL and anon public key. Do not use the service role key.

## Target file structure

Prefer this final structure:

```text
TaskFlow/
├── app/
│   ├── _layout.js
│   └── index.js
├── components/
│   ├── AddTaskModal.jsx
│   └── TaskItem.jsx
├── lib/
│   └── supabase.js
├── package.json
└── .agents/
    └── agents.md
```

If the project still uses legacy `App.js`, move the screen content into `app/index.js` after installing Expo Router.

## Component responsibilities

### `components/TaskItem.jsx`

Create a presentational component only. It should:

- Import `View`, `Text`, `TouchableOpacity`, and `StyleSheet` from `react-native`.
- Import `MaterialIcons` from `@expo/vector-icons`.
- Accept props: `{ item, onToggle, onDelete }`.
- Render one task row.
- Use `check-box` when `item.completed` is true.
- Use `check-box-outline-blank` when `item.completed` is false.
- Call `onToggle(item)` on tap.
- Call `onDelete(item.id)` on long press.
- Not import Supabase.
- Not hold its own task state.

### `components/AddTaskModal.jsx`

Create a modal component. It should:

- Import `useState` from React.
- Use React Native `Modal`, `View`, `TextInput`, `TouchableOpacity`, `Text`, `Pressable`, and `StyleSheet`.
- Accept props: `{ visible, onClose, onSubmit }`.
- Use `animationType="slide"` and `transparent`.
- Render a semi-transparent dark backdrop.
- Render a white rounded card.
- Include a controlled `TextInput` for the task title.
- Include `Cancel` and `Add` buttons.
- Close when tapping the backdrop or Cancel.
- On Add, trim-check the input, call `onSubmit(text)`, then clear the input.
- Use an inner `Pressable` around the card so tapping inside the card does not close the modal.
- Use `onRequestClose={onClose}` for Android back button behavior.

## Main screen requirements: `app/index.js`

The main screen should:

- Import `useState` and `useEffect`.
- Import `View`, `Text`, `FlatList`, `TouchableOpacity`, and `StyleSheet` from `react-native`.
- Import `MaterialIcons` from `@expo/vector-icons`.
- Import `Toast` from `react-native-toast-message`.
- Import `supabase` from `../lib/supabase`.
- Import `TaskItem` and `AddTaskModal`.
- Keep state in the screen:
  - `tasks`, `setTasks`
  - `modalVisible`, `setModalVisible`
- Use `loadTasks()` in `useEffect` so tasks load on first render.
- Use `FlatList`, not raw `.map()`, for task rows.

Required data functions/handlers:

```javascript
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
```

```javascript
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
```

```javascript
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
```

```javascript
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
```

The UI should include:

- Header with title `TaskFlow`.
- A clear Add Task button using the MaterialIcons `add` icon.
- `AddTaskModal` controlled by `modalVisible`.
- A `FlatList` of `TaskItem` rows.
- Clean white background, rounded controls, modern spacing, and colors close to:
  - Primary blue: `#2E5BBA`
  - Dark text: `#1F2A44`
  - Muted gray: `#5A6472`

## Root layout requirements: `app/_layout.js`

Set up Expo Router and Toast at the root:

```javascript
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <>
      <Stack />
      <Toast />
    </>
  );
}
```

## Style conventions

- Use `StyleSheet.create`.
- Use camelCase style properties.
- Use numeric values without `px`.
- Keep header styles separate when helpful, such as `headerStyles` for the title region.
- Use `flexDirection: 'row'` for rows.
- Use `gap` for simple row spacing when supported.
- Use `flex: 1` on top-level containers and around `FlatList` so lists render correctly.

## Checkpoints and acceptance criteria

The finished app is acceptable when all of these are true:

- `npx expo start` runs without red error text.
- Expo Go can open the project on a phone.
- The main screen shows a `TaskFlow` header.
- The task list loads from Supabase on startup.
- Tapping Add Task opens a sliding modal, not a full screen transition.
- Tapping the dark backdrop or Cancel closes the modal without adding a task.
- Submitting a non-empty task inserts it into Supabase, closes the modal, refreshes the list, and shows a `Task added` toast.
- Empty task submissions do nothing.
- Tapping a task toggles its checkbox and updates Supabase.
- Long-pressing a task deletes it from Supabase and shows a `Task deleted` toast.
- Reloading the app keeps the same tasks because they are stored in Supabase.
- `TaskItem.jsx` and `AddTaskModal.jsx` contain no Supabase calls.
- The task list uses `FlatList`.
- Material Icons are used instead of plain text checkbox symbols.

## Common issues to check

- If tasks never load, check the Supabase URL, anon key, table name, and RLS setting.
- If Supabase returns an empty array with no error, the table may simply be empty.
- If `FlatList` does not appear, check that its parent has `flex: 1`.
- If the modal closes when tapping the input, check that the card has an inner `Pressable` with an empty `onPress`.
- If Expo Router fails, confirm the project has an `app/` folder and `app/_layout.js`.
- If Toasts do not show, confirm `<Toast />` is mounted at the root layout.

## Learning goals to preserve

When explaining changes to the user, connect the code back to these concepts:

- React Native primitives: `View`, `Text`, `TextInput`, `TouchableOpacity`, `StyleSheet`.
- Expo workflow and Expo Go testing.
- React Hooks: `useState` and `useEffect`.
- Controlled inputs.
- JavaScript objects as task data shape.
- Handler naming with `handle...`.
- Supabase CRUD.
- Components and props.
- `FlatList` for scalable rendering.
- Expo Router basics.
- Modal-based focused UI.
- Toast notifications for lightweight feedback.
