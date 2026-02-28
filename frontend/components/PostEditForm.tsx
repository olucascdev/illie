'use client';

import { Post } from '@/lib/db/schema';
import { updatePost } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'generated', label: 'Gerado' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'error', label: 'Erro' },
];

export default function PostEditForm({ post }: { post: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(post.title ?? '');
  const [linkedinPost, setLinkedinPost] = useState(post.linkedinPost ?? '');
  const [hashtagsRaw, setHashtagsRaw] = useState(post.hashtags ? post.hashtags.join(' ') : '');
  const [status, setStatus] = useState(post.status ?? 'generated');

  async function handleSave() {
    setSaving(true);
    const hashtags = hashtagsRaw.split(/\s+/).map((t) => t.trim()).filter(Boolean);
    await updatePost(post.id, { title, linkedinPost, shortPost: post.shortPost ?? '', hashtags, status });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--text)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    outline: 'none',
    width: '100%',
    padding: '8px 12px',
    transition: 'border-color 0.15s',
  };

  return (
    <div>
      {/* Title — Notion-style large editable */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sem título"
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text)',
          background: 'none',
          border: 'none',
          outline: 'none',
          width: '100%',
          letterSpacing: '-0.5px',
          padding: 0,
        }}
      />

      {/* Properties row */}
      <div className="mt-5 mb-8" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center py-2.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ width: '120px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            style={{ fontSize: '13px', color: 'var(--text)', background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center py-2.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ width: '120px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Notion ID</span>
          <span style={{ fontSize: '12px', color: 'var(--text-faint)', fontFamily: 'monospace' }}>{post.notionPageId}</span>
        </div>
        <div className="flex items-center py-2.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ width: '120px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Criado em</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR') : '—'}</span>
        </div>
        <div className="flex items-center py-2.5">
          <span style={{ width: '120px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Atualizado</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{post.updatedAt ? new Date(post.updatedAt).toLocaleString('pt-BR') : '—'}</span>
        </div>
      </div>

      {/* LinkedIn Post — large textarea */}
      <div className="mb-8">
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Post LinkedIn
        </p>
        <textarea
          value={linkedinPost}
          onChange={(e) => setLinkedinPost(e.target.value)}
          placeholder="Escreva o conteúdo do post para o LinkedIn…"
          style={{
            ...inputStyle,
            borderRadius: '8px',
            padding: '14px 16px',
            lineHeight: '1.8',
            resize: 'vertical',
            height: '400px',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Hashtags */}
      <div className="mb-8">
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Hashtags
        </p>
        <input
          type="text"
          value={hashtagsRaw}
          onChange={(e) => setHashtagsRaw(e.target.value)}
          placeholder="#marketing #linkedin #conteudo"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        {hashtagsRaw && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hashtagsRaw.split(/\s+/).filter(Boolean).map((tag, i) => (
              <span key={i} className="status-generated" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer transition-all"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            padding: '8px 24px',
            borderRadius: '6px',
            border: 'none',
            background: saved ? 'var(--success)' : 'var(--accent)',
            color: saved ? '#3d4a1f' : '#fff',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Salvando…' : saved ? '✓ Salvo' : 'Salvar'}
        </button>
        {saved && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Alterações salvas</span>
        )}
      </div>
    </div>
  );
}
