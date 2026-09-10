'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteContent } from '@/lib/types';

export default function AdminSiteContentPage() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Card 1 — Hero State
  const [heroH1, setHeroH1] = useState('I Build Websites.');
  const [heroH2, setHeroH2] = useState('I Build Intelligence.');
  const [heroSubtext, setHeroSubtext] = useState('Web development, AI chatbots, and voice agents — crafted for impact.');
  const [heroCta1, setHeroCta1] = useState('View My Work');
  const [heroCta2, setHeroCta2] = useState('Contact Me');

  // Card 2 — Services State
  const [s1Title, setS1Title] = useState('Web Development');
  const [s1Desc, setS1Desc] = useState('Fast, responsive, and visually stunning websites built for performance and conversions.');
  const [s2Title, setS2Title] = useState('AI Chatbots');
  const [s2Desc, setS2Desc] = useState('Intelligent conversational agents that automate support, qualify leads, and engage users 24/7.');
  const [s3Title, setS3Title] = useState('AI Voice Agents');
  const [s3Desc, setS3Desc] = useState('Human-like voice AI that handles calls, bookings, and customer interactions autonomously.');

  // Card 3 — About / Bio State
  const [aboutBio, setAboutBio] = useState('');
  const [aboutPhotoUrl, setAboutPhotoUrl] = useState<string | null>(null);
  const [aboutPhotoPreview, setAboutPhotoPreview] = useState<string | null>(null);
  const [aboutPhotoFile, setAboutPhotoFile] = useState<File | null>(null);

  // Card 4 — Contact Info State
  const [contactEmail, setContactEmail] = useState('hello@mahsan.dev');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');
  const [github, setGithub] = useState('https://github.com');
  const [twitter, setTwitter] = useState('https://twitter.com');
  const [instagram, setInstagram] = useState('https://instagram.com');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          const c = data as SiteContent;
          if (c.hero_headline_1) setHeroH1(c.hero_headline_1);
          if (c.hero_headline_2) setHeroH2(c.hero_headline_2);
          if (c.hero_subtext) setHeroSubtext(c.hero_subtext);
          if (c.hero_cta_primary) setHeroCta1(c.hero_cta_primary);
          if (c.hero_cta_secondary) setHeroCta2(c.hero_cta_secondary);

          if (c.service_1_title) setS1Title(c.service_1_title);
          if (c.service_1_description) setS1Desc(c.service_1_description);
          if (c.service_2_title) setS2Title(c.service_2_title);
          if (c.service_2_description) setS2Desc(c.service_2_description);
          if (c.service_3_title) setS3Title(c.service_3_title);
          if (c.service_3_description) setS3Desc(c.service_3_description);

          if (c.about_bio) setAboutBio(c.about_bio);
          if (c.about_photo_url) {
            setAboutPhotoUrl(c.about_photo_url);
            setAboutPhotoPreview(c.about_photo_url);
          }

          if (c.contact_email) setContactEmail(c.contact_email);
          if (c.social_linkedin) setLinkedin(c.social_linkedin);
          if (c.social_github) setGithub(c.social_github);
          if (c.social_twitter) setTwitter(c.social_twitter);
          if (c.social_instagram) setInstagram(c.social_instagram);
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const saveContentFields = async (sectionName: string, fields: Partial<SiteContent>) => {
    try {
      setSavingSection(sectionName);
      const supabase = createClient();
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: 1,
          ...fields,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      showToast(`${sectionName} saved successfully.`);
    } catch (err: unknown) {
      console.error(`Failed to save ${sectionName}:`, err);
      alert('Failed to save changes: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    saveContentFields('Hero Section', {
      hero_headline_1: heroH1,
      hero_headline_2: heroH2,
      hero_subtext: heroSubtext,
      hero_cta_primary: heroCta1,
      hero_cta_secondary: heroCta2,
    });
  };

  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    saveContentFields('Services Section', {
      service_1_title: s1Title,
      service_1_description: s1Desc,
      service_2_title: s2Title,
      service_2_description: s2Desc,
      service_3_title: s3Title,
      service_3_description: s3Desc,
    });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Profile photo must be under 3MB.');
      return;
    }
    setAboutPhotoFile(file);
    setAboutPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalPhotoUrl = aboutPhotoUrl;

    if (aboutPhotoFile) {
      try {
        setSavingSection('About Section');
        const supabase = createClient();
        const ext = aboutPhotoFile.name.split('.').pop() || 'jpg';
        const path = `profile/avatar-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from('profile')
          .upload(path, aboutPhotoFile, { upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: pubData } = supabase.storage
          .from('profile')
          .getPublicUrl(path);

        finalPhotoUrl = pubData.publicUrl;
        setAboutPhotoUrl(finalPhotoUrl);
      } catch (err: unknown) {
        console.error('Photo upload error:', err);
        alert('Photo upload failed: ' + (err instanceof Error ? err.message : String(err)));
        setSavingSection(null);
        return;
      }
    }

    saveContentFields('About Section', {
      about_bio: aboutBio,
      about_photo_url: finalPhotoUrl,
    });
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    saveContentFields('Contact Info', {
      contact_email: contactEmail,
      social_linkedin: linkedin,
      social_github: github,
      social_twitter: twitter,
      social_instagram: instagram,
    });
  };

  const cardStyle: React.CSSProperties = {
    background: '#111111',
    border: '1px solid #1F1F1F',
    borderRadius: '8px',
    padding: '28px',
    marginBottom: '32px',
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

  const saveBtnStyle: React.CSSProperties = {
    padding: '10px 24px',
    background: '#00E5FF',
    color: '#0A0A0A',
    fontWeight: 700,
    fontSize: '0.8125rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    alignSelf: 'flex-start',
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#888' }}>Loading site content…</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
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
          Site Content Editor
        </h1>
        <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
          Edit live copy, headlines, bio, and social links across the website
        </p>
      </div>

      {/* ── CARD 1: Hero Section ────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF', marginTop: 0, marginBottom: '20px' }}>
          Card 1 — Hero Section
        </h2>
        <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Hero Headline Line 1</label>
            <input type="text" value={heroH1} onChange={e => setHeroH1(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hero Headline Line 2</label>
            <input type="text" value={heroH2} onChange={e => setHeroH2(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hero Subtext</label>
            <textarea rows={3} value={heroSubtext} onChange={e => setHeroSubtext(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Primary CTA Label</label>
              <input type="text" value={heroCta1} onChange={e => setHeroCta1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Secondary CTA Label</label>
              <input type="text" value={heroCta2} onChange={e => setHeroCta2(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <button type="submit" disabled={savingSection === 'Hero Section'} style={saveBtnStyle}>
            {savingSection === 'Hero Section' ? 'Saving…' : 'Save Hero Changes'}
          </button>
        </form>
      </div>

      {/* ── CARD 2: Service Cards ───────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF', marginTop: 0, marginBottom: '20px' }}>
          Card 2 — Service Cards
        </h2>
        <form onSubmit={handleSaveServices} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Service 1 */}
          <div style={{ padding: '16px', background: '#161616', borderRadius: '6px', border: '1px solid #222' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase' }}>Service 1</span>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Title</label>
              <input type="text" value={s1Title} onChange={e => setS1Title(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Description</label>
              <textarea rows={2} value={s1Desc} onChange={e => setS1Desc(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          {/* Service 2 */}
          <div style={{ padding: '16px', background: '#161616', borderRadius: '6px', border: '1px solid #222' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase' }}>Service 2</span>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Title</label>
              <input type="text" value={s2Title} onChange={e => setS2Title(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Description</label>
              <textarea rows={2} value={s2Desc} onChange={e => setS2Desc(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          {/* Service 3 */}
          <div style={{ padding: '16px', background: '#161616', borderRadius: '6px', border: '1px solid #222' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00E5FF', textTransform: 'uppercase' }}>Service 3</span>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Title</label>
              <input type="text" value={s3Title} onChange={e => setS3Title(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label style={labelStyle}>Description</label>
              <textarea rows={2} value={s3Desc} onChange={e => setS3Desc(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <button type="submit" disabled={savingSection === 'Services Section'} style={saveBtnStyle}>
            {savingSection === 'Services Section' ? 'Saving…' : 'Save Services Changes'}
          </button>
        </form>
      </div>

      {/* ── CARD 3: About / Bio ─────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF', marginTop: 0, marginBottom: '20px' }}>
          Card 3 — About / Bio
        </h2>
        <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Bio Text (Markdown / Line breaks supported)</label>
            <textarea
              rows={6}
              value={aboutBio}
              onChange={e => setAboutBio(e.target.value)}
              placeholder="Tell your story, your engineering philosophy and background..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Profile Photo (PNG, JPG up to 3MB)</label>
            <input type="file" accept="image/*" onChange={handlePhotoSelect} style={{ color: '#888', fontSize: '0.875rem' }} />

            {aboutPhotoPreview && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={aboutPhotoPreview}
                  alt="Profile Preview"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E5FF' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Active Profile Photo</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={savingSection === 'About Section'} style={saveBtnStyle}>
            {savingSection === 'About Section' ? 'Saving…' : 'Save About Changes'}
          </button>
        </form>
      </div>

      {/* ── CARD 4: Contact Info ────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF', marginTop: 0, marginBottom: '20px' }}>
          Card 4 — Contact Info &amp; Social Links
        </h2>
        <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Contact Email</label>
            <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input type="text" value={github} onChange={e => setGithub(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Twitter / X URL</label>
            <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Instagram URL</label>
            <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" disabled={savingSection === 'Contact Info'} style={saveBtnStyle}>
            {savingSection === 'Contact Info' ? 'Saving…' : 'Save Contact Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
