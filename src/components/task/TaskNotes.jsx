import { useState } from 'react';
import { usePlan } from '../../context/PlanContext';

export default function TaskNotes({ task }) {
  const { dispatch } = usePlan();
  const [noteText, setNoteText] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    dispatch({ type: 'ADD_NOTE', payload: { taskId: task.id, text: noteText.trim() } });
    setNoteText('');
  };

  const userNotes = task.notes.filter(n => n.type === 'user');
  const statusNotes = task.notes.filter(n => n.type === 'status_change');

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddNote} className="flex gap-2">
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-bg-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Add
        </button>
      </form>

      {userNotes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Notes</h4>
          {userNotes.map(note => (
            <div key={note.id} className="bg-bg-tertiary rounded-lg p-3">
              <p className="text-sm text-text-primary">{note.text}</p>
              <p className="text-[10px] text-text-muted mt-1">
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {statusNotes.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider">History</h4>
          {statusNotes.map(note => (
            <div key={note.id} className="flex items-center gap-2 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted flex-shrink-0" />
              <span>{note.text}</span>
              <span className="ml-auto text-[10px]">
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
