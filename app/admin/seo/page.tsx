'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SeoMetadata } from '@/lib/types';

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [siteTitle, setSiteTitle] = useState('M.Ahsan — Web Development · AI Chatbots · AI Voice Agents');
  const [siteDescription, setSiteDescription] = useState('M.Ahsan is a developer specialising in web development, AI chatbots, and AI voice agents.');
  const [ogTitle, setOgTitle] = useState('M.Ahsan — Web Development · AI Chatbots · AI Voice Agents');
  const [ogDescription, setOgDescription] = useState('M.Ahsan — developer specialising in web development, AI chatbots, and AI voice agents.');
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [twitterHandle, setTwitterHandle] = useState('@mahsan');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('seo_metadata')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          const s = data as SeoMetadata;
          if (s.site_title) setSiteTitle(s.site_title);
          if (s.site_description) setSiteDescription(s.site_description);
          if (s.og_title) setOgTitle(s.og_title);
          if (s.og_description) setOgDescription(s.og_description);
          if (s.og_image_url) {
            setOgImageUrl(s.og_image_url);
            setOgImagePreview(s.og_image_url);
          }
          if (s.twitter_handle) setTwitterHandle(s.twitter_handle);
        }
      } catch (err) {
        console.error('Failed to load SEO metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeo();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('OG image file must be under 5MB.');
      return;
    }
    setOgImageFile(file);
    setOgImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let finalImageUrl = ogImageUrl;

    try {
      const supabase = createClient();

      // Upload OG image if selected
      if (ogImageFile) {
        const ext = ogImageFile.name.split('.').pop() || 'jpg';
        const path = `seo/og-image-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(path, ogImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: pubData } = supabase.storage
          .from('project-images')
          .getPublicUrl(path);

        finalImageUrl = pubData.publicUrl;
        setOgImageUrl(finalImageUrl);
      }

      const { error } = await supabase
        .from('seo_metadata')
        .upsert({
          id: 1,
          site_title: siteTitle,
          site_description: siteDescription,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image_url: finalImageUrl,
          twitter_handle: twitterHandle,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      showToast('SEO settings saved successfully.');
    } catch (err: unknown) {
      console.error('Failed to save SEO settings:', err);
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#CCC',
    marginBottom: '6px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#181818',
    border: '1px solid #282828',
    borderRadius: '6px',
    color: '#FFF',
    fontSize: '0.875rem',
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#888' }}>Loading SEO configuration…</div>;
  }

  return (
    <div style={{ maxWidth: '720px' }}>
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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
          SEO &amp; Social Metadata
        </h1>
        <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
          Configure titles, descriptions, and Open Graph previews for search engines &amp; social sharing
        </p>
      </div>

      <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', padding: '32px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Site Title */}
          <div>
            <label style={labelStyle}>Site Title (Browser tab)</label>
            <input
              type="text"
              value={siteTitle}
              onChange={e => setSiteTitle(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Meta Description with Char Counter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Meta Description</label>
              <span style={{ fontSize: '0.75rem', color: siteDescription.length > 160 ? '#FF4444' : '#888' }}>
                {siteDescription.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={siteDescription}
              onChange={e => setSiteDescription(e.target.value)}
              maxLength={180}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* OG Title */}
          <div>
            <label style={labelStyle}>Open Graph (OG) Title</label>
            <input
              type="text"
              value={ogTitle}
              onChange={e => setOgTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* OG Description */}
          <div>
            <label style={labelStyle}>Open Graph (OG) Description</label>
            <textarea
              rows={3}
              value={ogDescription}
              onChange={e => setOgDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* OG Image */}
          <div>
            <label style={labelStyle}>Social Share Image (OG Image — 1200x630 recommended)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ color: '#888', fontSize: '0.875rem' }}
            />

            {ogImagePreview && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={ogImagePreview}
                  alt="OG Preview"
                  style={{ width: '160px', height: '84px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Active Social Share Image</span>
              </div>
            )}
          </div>

          {/* Twitter Handle */}
          <div>
            <label style={labelStyle}>Twitter Handle</label>
            <input
              type="text"
              value={twitterHandle}
              onChange={e => setTwitterHandle(e.target.value)}
              placeholder="@mahsan"
              style={inputStyle}
            />
          </div>

          {/* Save Button */}
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
              alignSelf: 'flex-start',
              marginTop: '8px',
            }}
          >
            {saving ? 'Saving…' : 'Save SEO Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
