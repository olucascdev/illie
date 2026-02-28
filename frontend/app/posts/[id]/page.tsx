import { getPostById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import PostEditForm from '@/components/PostEditForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-6" style={{ fontSize: '13px' }}>
        <Link href="/posts" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          Posts
        </Link>
        <span style={{ color: 'var(--text-faint)' }}>/</span>
        <span className="truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
          {post.title || 'Sem título'}
        </span>
      </div>

      <PostEditForm post={post} />
    </div>
  );
}
