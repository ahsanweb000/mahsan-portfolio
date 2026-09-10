'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Project, ProjectCategory, ProjectStatus } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('web_dev');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<ProjectStatus>('published');
  const [order, setOrder] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      showToast('Error loading projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setCurrentId(null);
    setTitle('');
    setDescription('');
    setCategory('web_dev');
    setYear(new Date().getFullYear());
    setStatus('published');
    setOrder(projects.length + 1);
    setImageUrl(null);
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const openNewForm = () => {
    resetForm();
    setIsEditing(true);
  };

  const openEditForm = (p: Project) => {
    setCurrentId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setYear(p.year);
    setStatus(p.status);
    setOrder(p.order);
    setImageUrl(p.image_url);
    setImagePreview(p.image_url);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    let finalImageUrl = imageUrl;

    try {
      // 1. Upload new image to Storage if selected
      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error('Image upload failed: ' + uploadError.message);
        }

        const { data: publicData } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicData.publicUrl;
      }

      // 2. Save / Update in DB
      if (currentId) {
        const { error } = await supabase
          .from('projects')
          .update({
            title,
            description,
            category,
            year: Number(year),
            status,
            order: Number(order),
            image_url: finalImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentId);

        if (error) throw error;
        showToast('Project updated successfully.');
      } else {
        const { error } = await supabase.from('projects').insert({
          title,
          description,
          category,
          year: Number(year),
          status,
          order: Number(order),
          image_url: finalImageUrl,
        });

        if (error) throw error;
        showToast('Project created successfully.');
      }

      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      console.error('Save error:', err);
      alert('Failed to save project: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete project "${title}"? This cannot be undone.`)) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      showToast('Project deleted.');
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete project.');
    }
  };

  const categoryNames: Record<ProjectCategory, string> = {
    web_dev: 'Web Development',
    ai_chatbot: 'AI Chatbot',
    voice_agent: 'Voice Agent',
  };

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#00E5FF',
          color: '#0A0A0A',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '0.875rem',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
            Projects Catalog
          </h1>
          <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Manage portfolio projects shown on Home and Work pages
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={openNewForm}
            style={{
              padding: '10px 20px',
              background: '#00E5FF',
              color: '#0A0A0A',
              fontWeight: 700,
              fontSize: '0.875rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Add New Project
          </button>
        )}
      </div>

      {/* ── Form View (Add / Edit) ───────────────────────── */}
      {isEditing ? (
        <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', padding: '32px', maxWidth: '720px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: 0, marginBottom: '24px' }}>
            {currentId ? 'Edit Project' : 'New Project'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="e.g. NextCommerce — E-Commerce Platform"
                className="admin-input-field"
                style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF' }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Short description displayed on project cards"
                className="admin-input-field"
                style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF', resize: 'vertical' }}
              />
            </div>

            {/* Category & Year Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ProjectCategory)}
                  className="admin-input-field"
                  style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="web_dev">Web Development</option>
                  <option value="ai_chatbot">AI Chatbot</option>
                  <option value="voice_agent">Voice Agent</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                  Year *
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  required
                  className="admin-input-field"
                  style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Status & Order Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                  Status *
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as ProjectStatus)}
                  className="admin-input-field"
                  style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF' }}
                >
                  <option value="published">Published (Visible on site)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                  Display Order (lower = first)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={e => setOrder(Number(e.target.value))}
                  className="admin-input-field"
                  style={{ width: '100%', padding: '10px 14px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CCCCCC', marginBottom: '6px' }}>
                Project Image (JPG, PNG, WebP up to 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ color: '#888', fontSize: '0.875rem' }}
              />

              {imagePreview && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Thumbnail Preview</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 28px',
                  background: saving ? '#555' : '#00E5FF',
                  color: '#0A0A0A',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '12px 20px',
                  background: '#1A1A1A',
                  color: '#CCC',
                  fontSize: '0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── List View Table ───────────────────────────── */
        <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading projects…</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#888' }}>
              No projects found. Click &quot;+ Add New Project&quot; to create your first item!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E1E', color: '#666666', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px', width: '80px' }}>Thumbnail</th>
                  <th style={{ padding: '14px 20px' }}>Title</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Year</th>
                  <th style={{ padding: '14px 20px' }}>Order</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1A1A1A' }}>
                    {/* Thumbnail */}
                    <td style={{ padding: '12px 20px' }}>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          style={{ width: '60px', height: '34px', objectFit: 'cover', borderRadius: '4px', background: '#1E1E1E' }}
                        />
                      ) : (
                        <div style={{ width: '60px', height: '34px', borderRadius: '4px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#555' }}>
                          ✦
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td style={{ padding: '14px 20px', color: '#FFF', fontWeight: 600 }}>
                      {p.title}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 20px', color: '#AAA' }}>
                      {categoryNames[p.category] || p.category}
                    </td>

                    {/* Year */}
                    <td style={{ padding: '14px 20px', color: '#888' }}>
                      {p.year}
                    </td>

                    {/* Order */}
                    <td style={{ padding: '14px 20px', color: '#888' }}>
                      {p.order}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: p.status === 'published' ? 'rgba(0, 196, 140, 0.12)' : '#1C1C1C',
                        color: p.status === 'published' ? '#00C48C' : '#888888',
                      }}>
                        {p.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditForm(p)}
                          style={{
                            padding: '6px 12px',
                            background: '#1A1A1A',
                            border: '1px solid #282828',
                            color: '#FFF',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255, 68, 68, 0.1)',
                            border: '1px solid rgba(255, 68, 68, 0.25)',
                            color: '#FF4444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style>{`
        .admin-input-field:focus {
          border-color: #00E5FF !important;
          box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.4) !important;
          outline: none;
        }
      `}</style>
    </div>
  );
}
