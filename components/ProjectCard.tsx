'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web Dev' | 'AI Chatbot' | 'Voice Agent';
  year: string;
  imageUrl?: string;
  href?: string;
}

const CATEGORY_STYLES: Record<Project['category'], React.CSSProperties> = {
  'Web Dev': {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--color-text-secondary)',
  },
  'AI Chatbot': {
    background: 'rgba(0,229,255,0.08)',
    border: '1px solid rgba(0,229,255,0.2)',
    color: 'var(--color-accent)',
  },
  'Voice Agent': {
    background: 'rgba(0,229,255,0.08)',
    border: '1px solid rgba(0,229,255,0.2)',
    color: 'var(--color-accent)',
  },
};

export default function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const tag = CATEGORY_STYLES[project.category];

  return (
    <Link
      href={project.href ?? '/work'}
      data-cursor-grow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        ...(hovered ? {
          borderColor: 'rgba(0,229,255,0.25)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        } : {}),
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', background: 'var(--color-surface)' }}>
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <span style={{ fontSize: '2.5rem', opacity: 0.2 }}>✦</span>
          </div>
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <span style={{
            fontSize: 'var(--text-small)', fontWeight: 700,
            color: 'var(--color-white)',
            padding: '10px 24px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 'var(--radius-sm)',
            backdropFilter: 'blur(8px)',
          }}>
            View Project →
          </span>
        </div>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
          <span style={{
            fontSize: 'var(--text-xs)', fontWeight: 600,
            padding: '4px 10px', borderRadius: 'var(--radius-full)',
            ...tag,
          }}>
            {project.category}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {project.year}
          </span>
        </div>

        <h3 style={{
          fontSize: 'var(--text-h3)', fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: 'var(--space-xs)',
          transition: 'color 0.2s ease',
          ...(hovered ? { color: 'var(--color-accent)' } : {}),
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>
      </div>
    </Link>
  );
}