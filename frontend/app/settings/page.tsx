'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { getAgentConfig, updateAgentConfig } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getAgentConfig().then((val) => {
      if (val) setPrompt(val);
      setLoading(false);
    });
  }, []);

  function handleSave() {
    if (!prompt.trim()) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    startTransition(async () => {
      try {
        await updateAgentConfig(prompt.trim());
        setFeedback({ type: 'success', msg: 'Prompt salvo com sucesso.' });
      } catch {
        setFeedback({ type: 'error', msg: 'Erro ao salvar. Tente novamente.' });
      } finally {
        feedbackTimer.current = setTimeout(() => setFeedback(null), 3500);
      }
    });
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.6px',
            lineHeight: 1.2,
          }}
        >
          Configurações
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Edite o prompt que define o comportamento do agente Illie.
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-xl p-6"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        {/* Section title */}
        <div className="flex items-center gap-2 mb-4">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}
          >
            Prompt do agente
          </span>
        </div>

        {/* Textarea */}
        {loading ? (
          <div
            className="rounded-lg animate-pulse"
            style={{ height: '360px', background: 'var(--border)' }}
          />
        ) : (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={18}
            style={{
              width: '100%',
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '14px 16px',
              fontSize: '13px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              lineHeight: 1.65,
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = 'var(--accent)')
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = 'var(--border)')
            }
            placeholder="Cole aqui o prompt do agente..."
            spellCheck={false}
          />
        )}

        {/* Char count */}
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-faint)',
            marginTop: '6px',
            textAlign: 'right',
          }}
        >
          {prompt.length} caracteres
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          {/* Feedback */}
          <div style={{ minHeight: '20px' }}>
            {feedback && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color:
                    feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {feedback.type === 'success' ? '✓' : '✗'} {feedback.msg}
              </span>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isPending || loading || !prompt.trim()}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: isPending ? 'var(--accent-soft)' : 'var(--accent)',
              color: isPending ? 'var(--accent)' : '#fff',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: isPending || loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s, background 0.15s',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {isPending ? 'Salvando...' : 'Salvar prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}
