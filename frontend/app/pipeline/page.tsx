import { getPipelineRuns } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const runs = await getPipelineRuns();
  const reversed = [...runs].reverse();

  const totalRuns = runs.length;
  const successRuns = runs.filter((r) => !r.errorDetail).length;
  const totalPagesOk = runs.reduce((a, r) => a + (r.pagesOk ?? 0), 0);
  const totalPagesError = runs.reduce((a, r) => a + (r.pagesError ?? 0), 0);

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
        Pipeline
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
        Histórico de execuções do Kestra
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-8 mb-10">
        {[
          { label: 'Execuções', value: totalRuns, icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          ) },
          { label: 'Sucesso', value: successRuns, icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) },
          { label: 'Págs. OK', value: totalPagesOk, icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ) },
          { label: 'Págs. erro', value: totalPagesError, icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-4 rounded-xl"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-accent" style={{ color: 'var(--accent)' }}>{stat.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Runs */}
      {reversed.length === 0 ? (
        <div className="py-16 text-center rounded-xl" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)', fontSize: '13px' }}>
          Nenhuma execução encontrada.
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {reversed.map((run, i) => {
            const ok = !run.errorDetail;
            return (
              <div key={run.id} className="px-5 py-4"
                style={{ borderBottom: i < reversed.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: ok ? 'var(--success)' : 'var(--danger)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                        {ok ? 'Sucesso' : 'Erro'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'monospace' }}>
                        {run.flowExecution || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    {[
                      { val: run.pagesFound ?? 0, label: 'encontr.' },
                      { val: run.pagesOk ?? 0, label: 'OK' },
                      { val: run.pagesError ?? 0, label: 'erro' },
                    ].map((m) => (
                      <span key={m.label} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        <b style={{ color: 'var(--text)', fontWeight: 600 }}>{m.val}</b> {m.label}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0" style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                    {run.executedAt ? new Date(run.executedAt).toLocaleDateString('pt-BR') : '—'}
                  </span>
                </div>

                {(run.pagesFound ?? 0) > 0 && (
                  <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full"
                      style={{
                        width: `${((run.pagesOk ?? 0) / (run.pagesFound ?? 1)) * 100}%`,
                        background: ok ? 'var(--success)' : 'var(--danger)',
                        transition: 'width 0.3s ease',
                      }} />
                  </div>
                )}

                {run.errorDetail && (
                  <div className="mt-3 px-3 py-2 rounded-md"
                    style={{ background: 'var(--danger-soft)', fontSize: '11px', color: 'var(--danger)', lineHeight: '1.6' }}>
                    {run.errorDetail}
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
