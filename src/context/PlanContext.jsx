import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import seedData from '../data/seedData';

const STORAGE_KEY = 'blueprint-52-week';
const PlanContext = createContext(null);

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  return structuredClone(seedData);
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

function findAndUpdateTask(quarters, taskId, updater) {
  return quarters.map(q => ({
    ...q,
    blocks: q.blocks.map(b => ({
      ...b,
      tasks: b.tasks.map(t => (t.id === taskId ? updater(t) : t)),
    })),
  }));
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TASK_STATUS': {
      const { taskId, status } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        quarters: findAndUpdateTask(state.quarters, taskId, t => ({
          ...t,
          status,
          date_completed: status === 'completed' ? now : t.date_completed,
          notes: [
            ...t.notes,
            { id: `n-${Date.now()}`, text: `Status changed to ${status}`, created_at: now, type: 'status_change' },
          ],
        })),
      };
    }
    case 'DEFER_TASK': {
      const { taskId, toWeek } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        quarters: findAndUpdateTask(state.quarters, taskId, t => ({
          ...t,
          status: 'deferred',
          deferred_to_week: toWeek,
          notes: [
            ...t.notes,
            { id: `n-${Date.now()}`, text: `Deferred from week ${t.due_week} to week ${toWeek}`, created_at: now, type: 'status_change' },
          ],
        })),
      };
    }
    case 'ADD_NOTE': {
      const { taskId, text } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        quarters: findAndUpdateTask(state.quarters, taskId, t => ({
          ...t,
          notes: [...t.notes, { id: `n-${Date.now()}`, text, created_at: now, type: 'user' }],
        })),
      };
    }
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    }
    case 'TOGGLE_MILESTONE': {
      const { quarterId, milestoneId } = action.payload;
      return {
        ...state,
        quarters: state.quarters.map(q =>
          q.id === quarterId
            ? {
                ...q,
                milestones: q.milestones.map(m =>
                  m.id === milestoneId ? { ...m, completed: !m.completed } : m
                ),
              }
            : q
        ),
      };
    }
    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        quarters: findAndUpdateTask(state.quarters, taskId, t => {
          const changeNotes = [];
          for (const [key, value] of Object.entries(updates)) {
            if (t[key] !== value) {
              changeNotes.push({
                id: `n-${Date.now()}-${key}`,
                text: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')} changed from "${t[key]}" to "${value}"`,
                created_at: now,
                type: 'edit',
              });
            }
          }
          return { ...t, ...updates, notes: [...t.notes, ...changeNotes] };
        }),
      };
    }
    case 'ADD_TASK': {
      const { blockId, task } = action.payload;
      const newTask = {
        id: `custom-${Date.now()}`,
        domain: 'technical',
        status: 'not_started',
        priority: 'normal',
        deferred_to_week: null,
        date_completed: null,
        notes: [],
        links: [],
        custom: true,
        ...task,
      };
      return {
        ...state,
        quarters: state.quarters.map(q => ({
          ...q,
          blocks: q.blocks.map(b =>
            b.id === blockId ? { ...b, tasks: [...b.tasks, newTask] } : b
          ),
        })),
      };
    }
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      return {
        ...state,
        quarters: state.quarters.map(q => ({
          ...q,
          blocks: q.blocks.map(b => ({
            ...b,
            tasks: b.tasks.filter(t => t.id !== taskId),
          })),
        })),
      };
    }
    case 'MOVE_TASK': {
      const { taskId, toWeek } = action.payload;
      const now = new Date().toISOString();
      let movedTask = null;

      // Find and remove the task
      const quartersWithout = state.quarters.map(q => ({
        ...q,
        blocks: q.blocks.map(b => ({
          ...b,
          tasks: b.tasks.filter(t => {
            if (t.id === taskId) {
              movedTask = {
                ...t,
                due_week: toWeek,
                notes: [
                  ...t.notes,
                  { id: `n-${Date.now()}`, text: `Moved from Week ${t.due_week} to Week ${toWeek}`, created_at: now, type: 'edit' },
                ],
              };
              return false;
            }
            return true;
          }),
        })),
      }));

      if (!movedTask) return state;

      // Find the target block by matching toWeek against week_range
      let placed = false;
      const quartersWithMoved = quartersWithout.map(q => ({
        ...q,
        blocks: q.blocks.map(b => {
          if (!placed && toWeek >= b.week_range[0] && toWeek <= b.week_range[1]) {
            placed = true;
            return { ...b, tasks: [...b.tasks, movedTask] };
          }
          return b;
        }),
      }));

      // If no matching block found, place in the nearest block
      if (!placed) {
        let bestBlock = null;
        let bestDist = Infinity;
        for (const q of quartersWithMoved) {
          for (const b of q.blocks) {
            const dist = Math.min(Math.abs(toWeek - b.week_range[0]), Math.abs(toWeek - b.week_range[1]));
            if (dist < bestDist) {
              bestDist = dist;
              bestBlock = b.id;
            }
          }
        }
        return {
          ...state,
          quarters: quartersWithMoved.map(q => ({
            ...q,
            blocks: q.blocks.map(b =>
              b.id === bestBlock ? { ...b, tasks: [...b.tasks, movedTask] } : b
            ),
          })),
        };
      }

      return { ...state, quarters: quartersWithMoved };
    }
    case 'UPDATE_META': {
      return {
        ...state,
        meta: { ...state.meta, ...action.payload },
      };
    }
    case 'IMPORT_STATE': {
      return action.payload;
    }
    case 'RESET': {
      return structuredClone(seedData);
    }
    default:
      return state;
  }
}

export function PlanProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const saveTimeout = useRef(null);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveState(state), 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [state]);

  const getAllTasks = useCallback(() => {
    const tasks = [];
    for (const q of state.quarters) {
      for (const b of q.blocks) {
        tasks.push(...b.tasks);
      }
    }
    return tasks;
  }, [state.quarters]);

  const getTask = useCallback((taskId) => {
    for (const q of state.quarters) {
      for (const b of q.blocks) {
        const t = b.tasks.find(task => task.id === taskId);
        if (t) return t;
      }
    }
    return null;
  }, [state.quarters]);

  return (
    <PlanContext.Provider value={{ state, dispatch, getAllTasks, getTask }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
