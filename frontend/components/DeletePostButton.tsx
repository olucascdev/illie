'use client';

import { deletePost } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
      return;
    }
    setLoading(true);
    await deletePost(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="transition-colors cursor-pointer"
      style={{
        fontSize: '12px',
        color: confirm ? 'var(--danger)' : 'var(--text-faint)',
        background: 'none',
        border: 'none',
        fontWeight: confirm ? 500 : 400,
        opacity: loading ? 0.4 : 1,
      }}
    >
      {loading ? '…' : confirm ? 'Confirmar?' : 'Excluir'}
    </button>
  );
}
