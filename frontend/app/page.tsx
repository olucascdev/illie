import { getPosts, getPipelineRuns } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [allPosts, runs] = await Promise.all([getPosts(), getPipelineRuns()]);

  const totalPosts = allPosts.length;
  const publishedPosts = allPosts.filter((p) => p.status === 'published').length;
  const generatedPosts = allPosts.filter((p) => p.status === 'generated').length;
  const totalRuns = runs.length;
  const successRuns = runs.filter((r) => !r.errorDetail).length;
  const lastRun = runs.at(-1);
  const recentPosts = [...allPosts].reverse().slice(0, 6);

  return (
    <div>
      {/* Hero Header */}
      <div style={{ marginBottom: '40px' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Sistema ativo
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Seu pipeline Notion → LinkedIn está funcionando.
          {totalPosts > 0 && ` Você tem ${totalPosts} post${totalPosts > 1 ? 's' : ''} gerado${totalPosts > 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Posts', value: totalPosts, sub: `${publishedPosts} publicado${publishedPosts !== 1 ? 's' : ''}`, icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ) },
          { label: 'Gerados', value: generatedPosts, sub: 'aguardando revisão', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ) },
          { label: 'Runs', value: totalRuns, sub: `${successRuns} com sucesso`, icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          ) },
          {
            label: 'Última run',
            value: lastRun
              ? new Date(lastRun.executedAt!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
              : '—',
            sub: lastRun ? `${lastRun.pagesOk ?? 0} páginas OK` : 'nenhuma',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            ),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-5 py-4 rounded-xl"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center justify-between mb-3 text-muted-foreground">
              <span className="text-accent" style={{ color: 'var(--accent)' }}>{stat.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </span>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            Posts recentes
          </h2>
          <Link href="/posts" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
            Ver todos →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="py-12 text-center rounded-xl" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)', fontSize: '13px' }}>
            Nenhum post encontrado. Execute o pipeline para começar.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {recentPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors table-row-hover block"
                style={{
                  borderBottom: i < recentPosts.length - 1 ? '1px solid var(--border-light)' : 'none',
                  textDecoration: 'none',
                  color: 'var(--text)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="flex-1 truncate" style={{ fontSize: '13px' }}>
                  {post.title || 'Sem título'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium status-${post.status}`}>
                  {post.status}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline Summary */}
      {lastRun && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              Pipeline
            </h2>
            <Link href="/pipeline" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
              Histórico →
            </Link>
          </div>

          <div className="rounded-xl p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ background: lastRun.errorDetail ? 'var(--danger)' : 'var(--success)' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                {lastRun.errorDetail ? 'Última execução com erro' : 'Última execução com sucesso'}
              </span>
              <span className="ml-auto" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {lastRun.executedAt ? new Date(lastRun.executedAt).toLocaleString('pt-BR') : ''}
              </span>
            </div>

            <div className="flex gap-8">
              {[
                { label: 'Encontradas', val: lastRun.pagesFound ?? 0 },
                { label: 'Processadas', val: lastRun.pagesOk ?? 0 },
                { label: 'Com erro', val: lastRun.pagesError ?? 0 },
              ].map((m) => (
                <div key={m.label}>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                    {m.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress */}
            {(lastRun.pagesFound ?? 0) > 0 && (
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${((lastRun.pagesOk ?? 0) / (lastRun.pagesFound ?? 1)) * 100}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--success))',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
