'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Skill } from '@/lib/types';

const CATEGORIES = [
  'Web Development',
  'AI & Automation',
  'Backend & Database',
  'Tools',
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [order, setOrder] = useState(1);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      console.error('Failed to load skills:', err);
      showToast('Error loading skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('skills').insert({
        name: name.trim(),
        category,
        order: Number(order),
      });

      if (error) throw error;
      showToast('Skill added successfully.');
      setName('');
      setOrder(skills.length + 1);
      setShowAddForm(false);
      fetchSkills();
    } catch (err: unknown) {
      console.error('Failed to add skill:', err);
      alert('Failed to add skill: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!confirm(`Delete skill "${skillName}"?`)) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      showToast('Skill deleted.');
      fetchSkills();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete skill.');
    }
  };

  // Group skills by category
  const groupedSkills = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div style={{ maxWidth: '840px' }}>
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
            Skills &amp; Tech Stack
          </h1>
          <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Manage the skills and tools displayed on the About page
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setOrder(skills.length + 1);
          }}
          style={{
            padding: '10px 20px',
            background: '#00E5FF',
            color: '#0A0A0A',
            fontWeight: 700,
            fontSize: '0.875rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {showAddForm ? 'Close Form' : '+ Add Skill'}
        </button>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF', marginTop: 0, marginBottom: '16px' }}>
            Add New Skill
          </h3>
          <form onSubmit={handleAddSkill} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                Skill Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. PyTorch"
                required
                style={{ width: '100%', padding: '10px 12px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF', fontSize: '0.875rem' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#AAA', marginBottom: '6px' }}>
                Order
              </label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', background: '#181818', border: '1px solid #282828', borderRadius: '6px', color: '#FFF', fontSize: '0.875rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 24px',
                background: '#00E5FF',
                color: '#0A0A0A',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: '6px',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                height: '42px',
              }}
            >
              {saving ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>
      )}

      {/* Skills Grouped by Category */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading skills…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {CATEGORIES.map(cat => {
            const list = groupedSkills[cat] || [];
            return (
              <div key={cat} style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', background: '#151515', borderBottom: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#FFF' }}>{cat}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{list.length} skill{list.length === 1 ? '' : 's'}</span>
                </div>

                {list.length === 0 ? (
                  <div style={{ padding: '20px', color: '#666', fontSize: '0.8125rem' }}>No skills in this category yet.</div>
                ) : (
                  <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {list.map(skill => (
                      <div
                        key={skill.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          background: '#1A1A1A',
                          border: '1px solid #282828',
                          borderRadius: '20px',
                          fontSize: '0.8125rem',
                          color: '#E0E0E0',
                        }}
                      >
                        <span>{skill.name}</span>
                        <span style={{ fontSize: '0.6875rem', color: '#666' }}>#{skill.order}</span>
                        <button
                          onClick={() => handleDelete(skill.id, skill.name)}
                          title="Delete skill"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 2px',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#FF4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#888'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
