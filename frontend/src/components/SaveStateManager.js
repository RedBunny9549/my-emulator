import { useState, useEffect, useRef } from "react";
import { HardDrive, Plus, Trash2, Tag, Clock, ChevronDown, ChevronUp, Download, Upload, Pencil, Check, X, Layers } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return "Never";
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const TAGS = [
  { label: "Before Gym", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Before Boss", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { label: "Safe Point", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { label: "Grind Spot", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { label: "Story Beat", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { label: "Custom", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
];

const STORAGE_KEY = "save_state_manager";

function loadAllStates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persistAllStates(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Tag Picker ─────────────────────────────────────────────────────────────

function TagPicker({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {TAGS.map((t) => (
        <button
          key={t.label}
          onClick={() => onChange(selected === t.label ? null : t.label)}
          className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all ${
            selected === t.label ? t.color : "text-gray-600 bg-transparent border-white/5 hover:border-white/15"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Single Save Slot ────────────────────────────────────────────────────────

function SaveSlot({ slot, romName, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(slot.name);
  const [editingTag, setEditingTag] = useState(false);
  const inputRef = useRef(null);

  const tagInfo = TAGS.find((t) => t.label === slot.tag);

  const commitName = () => {
    if (draft.trim()) onUpdate({ ...slot, name: draft.trim() });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitName();
    if (e.key === "Escape") { setDraft(slot.name); setEditing(false); }
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <div className="group bg-[#0A0A0C] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        {/* Slot icon + info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 flex-shrink-0 bg-[#141417] border border-white/5 rounded-lg flex items-center justify-center">
            <HardDrive className="w-4 h-4 text-gray-600" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Name */}
            {editing ? (
              <div className="flex items-center gap-1.5 mb-1">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-[#1A1A1D] border border-emerald-500/40 text-white text-sm px-2 py-0.5 rounded outline-none w-full"
                />
                <button onClick={commitName} className="text-emerald-400 hover:text-emerald-300 flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setDraft(slot.name); setEditing(false); }} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-white text-sm font-medium truncate">{slot.name}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-gray-400 transition-all flex-shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-gray-600 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDate(slot.savedAt)}</span>
              </div>
              {slot.tag && tagInfo && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tagInfo.color}`}>
                  {slot.tag}
                </span>
              )}
              <button
                onClick={() => setEditingTag((v) => !v)}
                className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-gray-400 text-xs flex items-center gap-0.5 transition-all"
              >
                <Tag className="w-3 h-3" />
              </button>
            </div>

            {/* Notes */}
            {slot.notes && (
              <p className="text-gray-600 text-xs mt-1.5 italic truncate">{slot.notes}</p>
            )}

            {/* Tag picker */}
            {editingTag && (
              <TagPicker
                selected={slot.tag}
                onChange={(tag) => {
                  onUpdate({ ...slot, tag });
                  setEditingTag(false);
                }}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onDelete(slot.id)}
            className="text-gray-700 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-all"
            title="Delete save state"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Slot Form ───────────────────────────────────────────────────────────

function NewSlotForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      notes: notes.trim(),
      tag,
      savedAt: Date.now(),
    });
  };

  return (
    <div className="bg-[#0A0A0C] border border-emerald-500/20 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">New Save State</p>

      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onCancel(); }}
        placeholder="Save state name..."
        className="w-full bg-[#141417] border border-white/5 focus:border-emerald-500/40 text-white placeholder-gray-600 text-sm px-3 py-2 rounded-lg outline-none transition-colors"
      />

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)..."
        className="w-full bg-[#141417] border border-white/5 focus:border-emerald-500/40 text-white placeholder-gray-600 text-xs px-3 py-2 rounded-lg outline-none transition-colors"
      />

      <div>
        <p className="text-xs text-gray-600 mb-1">Tag</p>
        <TagPicker selected={tag} onChange={setTag} />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 text-sm py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Save State Manager ──────────────────────────────────────────────────────

export default function SaveStateManager({ romName }) {
  const [allStates, setAllStates] = useState(loadAllStates);
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);

  const romKey = romName || "__global__";
  const slots = allStates[romKey] || [];

  const persist = (updated) => {
    setAllStates(updated);
    persistAllStates(updated);
  };

  const addSlot = (slot) => {
    const updated = { ...allStates, [romKey]: [slot, ...slots] };
    persist(updated);
    setAdding(false);
  };

  const deleteSlot = (id) => {
    if (!window.confirm("Delete this save state?")) return;
    const updated = { ...allStates, [romKey]: slots.filter((s) => s.id !== id) };
    persist(updated);
  };

  const updateSlot = (newSlot) => {
    const updated = {
      ...allStates,
      [romKey]: slots.map((s) => (s.id === newSlot.id ? newSlot : s)),
    };
    persist(updated);
  };

  // Export all states as JSON
  const exportStates = () => {
    const blob = new Blob([JSON.stringify(allStates, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `save-states-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import states from JSON
  const importRef = useRef(null);
  const importStates = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (typeof data === "object" && data !== null) {
          persist({ ...allStates, ...data });
        }
      } catch {
        alert("Invalid save state file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-left"
        >
          <Layers className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Save States</span>
          <span className="text-[10px] text-gray-700 font-mono bg-gray-800 px-1.5 py-0.5 rounded">
            {slots.length}
          </span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-700" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={importStates} />
          <button
            onClick={() => importRef.current?.click()}
            className="text-gray-700 hover:text-gray-400 p-1.5 rounded hover:bg-white/5 transition-all"
            title="Import save states"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={exportStates}
            className="text-gray-700 hover:text-gray-400 p-1.5 rounded hover:bg-white/5 transition-all"
            title="Export save states"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setAdding(true); setExpanded(true); }}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-3 space-y-2">
          {/* New slot form */}
          {adding && (
            <NewSlotForm onSave={addSlot} onCancel={() => setAdding(false)} />
          )}

          {/* Slot list */}
          {slots.length === 0 && !adding ? (
            <div className="text-center py-8">
              <HardDrive className="w-8 h-8 text-gray-800 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No save states yet</p>
              <p className="text-gray-700 text-xs mt-1">
                Press <kbd className="bg-gray-800 border border-gray-700 rounded px-1 text-gray-500 font-mono text-[10px]">F1</kbd> in-game or click New
              </p>
            </div>
          ) : (
            slots.map((slot) => (
              <SaveSlot
                key={slot.id}
                slot={slot}
                romName={romName}
                onDelete={deleteSlot}
                onUpdate={updateSlot}
              />
            ))
          )}

          {/* Tip */}
          {slots.length > 0 && (
            <p className="text-gray-700 text-[11px] text-center pt-1">
              Use <kbd className="bg-gray-800 border border-gray-700 rounded px-1 font-mono text-[10px]">F1</kbd> quick save · <kbd className="bg-gray-800 border border-gray-700 rounded px-1 font-mono text-[10px]">F2</kbd> quick load in-game
            </p>
          )}
        </div>
      )}
    </div>
  );
}
