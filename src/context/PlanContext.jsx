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
