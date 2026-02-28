import { getPosts } from '@/lib/actions';
import Link from 'next/link';
import DeletePostButton from '@/components/DeletePostButton';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  generated: 'Gerado',
  published: 'Publicado',
  draft: 'Rascunho',
  error: 'Erro',
};

export default async function PostsPage() {
  const posts = await getPosts();
  const reversed = [...posts].reverse();

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
        Posts
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
        {posts.length} post{posts.length !== 1 ? 's' : ''} no banco de dados
      </p>

      {reversed.length === 0 ? (
        <div className="py-16 text-center rounded-xl mt-8" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)', fontSize: '13px' }}>
          Nenhum post encontrado. Execute o pipeline para gerar posts.
        </div>
      ) : (
        <div className="mt-8 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Título', 'Status', 'Criado em', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3"
                    style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reversed.map((post, i) => (
                <tr key={post.id} className="table-row-hover"
                  style={{ borderBottom: i < reversed.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <td className="px-4 py-3">
                    <Link href={`/posts/${post.id}`} className="flex items-center gap-2.5"
                      style={{ color: 'var(--text)', fontSize: '13px', textDecoration: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="truncate max-w-xs">{post.title || 'Sem título'}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium status-${post.status}`}>
                      {STATUS_LABEL[post.status ?? 'generated'] ?? post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeletePostButton id={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
