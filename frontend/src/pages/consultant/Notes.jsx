import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
} from "lucide-react";

import {
  getConsultantNotes,
  createConsultantNote,
  updateConsultantNote,
  deleteConsultantNote,
} from "../../services/api";

import "../../styles/consultant/Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingNote, setEditingNote] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // ================= FETCH NOTES =================

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getConsultantNotes();

      if (response?.success) {
        setNotes(response.notes || []);
      } else {
        setNotes([]);
        setError(response?.message || "Failed to load notes");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);

      setError(
        err?.message ||
          err?.detail ||
          "Unable to load notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ================= OPEN ADD MODAL =================

  const handleAddNote = () => {
    setEditingNote(null);

    setFormData({
      title: "",
      content: "",
    });

    setError("");
    setShowModal(true);
  };

  // ================= OPEN EDIT MODAL =================

  const handleEditNote = (note) => {
    setEditingNote(note);

    setFormData({
      title: note.title || "",
      content: note.content || "",
    });

    setError("");
    setShowModal(true);
  };

  // ================= CLOSE MODAL =================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingNote(null);

    setFormData({
      title: "",
      content: "",
    });

    setError("");
  };

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= SAVE NOTE =================

  const handleSaveNote = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    const content = formData.content.trim();

    if (!title) {
      setError("Please enter a note title.");
      return;
    }

    if (!content) {
      setError("Please enter note content.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let response;

      if (editingNote) {
        // UPDATE
        response = await updateConsultantNote(
          editingNote.id,
          title,
          content
        );
      } else {
        // CREATE
        response = await createConsultantNote(
          title,
          content
        );
      }

      if (!response?.success) {
        throw new Error(
          response?.message ||
            response?.detail ||
            "Unable to save note"
        );
      }

      // Refresh notes from backend
      await fetchNotes();

      handleCloseModal();
    } catch (err) {
      console.error("Error saving note:", err);

      setError(
        err?.message ||
          err?.detail ||
          "Unable to save note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE NOTE =================

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await deleteConsultantNote(noteId);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            response?.detail ||
            "Unable to delete note"
        );
      }

      // Remove immediately from UI
      setNotes((previousNotes) =>
        previousNotes.filter(
          (note) => note.id !== noteId
        )
      );
    } catch (err) {
      console.error("Error deleting note:", err);

      setError(
        err?.message ||
          err?.detail ||
          "Unable to delete note. Please try again."
      );
    }
  };

  // ================= DATE FORMAT =================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ================= UI =================

  return (
    <div className="notes-page">

      {/* HEADER */}

      <div className="notes-header">
        <div>
          <div className="notes-title-row">
            <div className="notes-main-icon">
              <FileText size={26} />
            </div>

            <div>
              <h1>My Notes</h1>

              <p>
                Keep track of important observations,
                farmer consultations and recommendations.
              </p>
            </div>
          </div>
        </div>

        <button
          className="add-note-btn"
          onClick={handleAddNote}
        >
          <Plus size={18} />
          Add Note
        </button>
      </div>

      {/* ERROR */}

      {error && !showModal && (
        <div className="notes-error">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="notes-loading">
          <Loader2
            size={28}
            className="notes-spinner"
          />

          <span>Loading notes...</span>
        </div>
      ) : notes.length === 0 ? (

        /* EMPTY STATE */

        <div className="notes-card">
          <div className="notes-icon">
            <FileText
              size={32}
              strokeWidth={2}
            />
          </div>

          <h2 className="notes-title">
            No Notes Yet
          </h2>

          <p className="notes-description">
            Create your first note to keep important
            consultation details and observations organized.
          </p>

          <button
            className="empty-add-btn"
            onClick={handleAddNote}
          >
            <Plus size={18} />
            Create Your First Note
          </button>
        </div>

      ) : (

        /* NOTES */

        <div className="notes-grid">

          {notes.map((note) => (
            <div
              className="note-item"
              key={note.id}
            >

              <div className="note-item-header">

                <div className="note-item-icon">
                  <FileText size={21} />
                </div>

                <div className="note-heading">
                  <h3>{note.title}</h3>

                  <span className="note-date">
                    {formatDate(
                      note.updated_at ||
                        note.created_at
                    )}
                  </span>
                </div>

                <div className="note-actions">

                  <button
                    type="button"
                    className="note-edit-btn"
                    onClick={() =>
                      handleEditNote(note)
                    }
                    title="Edit note"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="note-delete-btn"
                    onClick={() =>
                      handleDeleteNote(note.id)
                    }
                    title="Delete note"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

              <div className="note-content">
                {note.content}
              </div>

            </div>
          ))}

        </div>
      )}

      {/* ================= MODAL ================= */}

      {showModal && (
        <div
          className="note-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >

          <div className="note-modal">

            {/* MODAL HEADER */}

            <div className="note-modal-header">

              <div>
                <h2>
                  {editingNote
                    ? "Edit Note"
                    : "Add Note"}
                </h2>

                <p>
                  {editingNote
                    ? "Update your consultation note."
                    : "Add an important observation or consultation note."}
                </p>
              </div>

              <button
                type="button"
                className="close-note-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSaveNote}>

              <div className="note-form-group">
                <label htmlFor="note-title">
                  Note Title
                </label>

                <input
                  id="note-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Rice Farmer Consultation"
                  maxLength={255}
                  disabled={saving}
                />
              </div>

              <div className="note-form-group">
                <label htmlFor="note-content">
                  Note
                </label>

                <textarea
                  id="note-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your observation or consultation details..."
                  rows={7}
                  disabled={saving}
                />
              </div>

              {error && (
                <div className="notes-error modal-error">
                  {error}
                </div>
              )}

              {/* ACTIONS */}

              <div className="note-modal-actions">

                <button
                  type="button"
                  className="cancel-note-btn"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-note-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="notes-spinner"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      {editingNote
                        ? "Update Note"
                        : "Save Note"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Notes;