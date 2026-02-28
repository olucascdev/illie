'use server';

import { db } from '@/lib/db';
import { posts, pipelineRuns, agentConfig } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ─── POSTS ────────────────────────────────────────────────────

export async function getPosts() {
  return db.select().from(posts).orderBy(posts.createdAt);
}

export async function getPostById(id: string) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] ?? null;
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    linkedinPost?: string;
    shortPost?: string;
    hashtags?: string[];
    status?: string;
  }
) {
  await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id));
  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath('/posts');
}

// ─── PIPELINE RUNS ────────────────────────────────────────────

export async function getPipelineRuns() {
  return db.select().from(pipelineRuns).orderBy(pipelineRuns.executedAt);
}

// ─── AGENT CONFIG ──────────────────────────────────────────────

export async function getAgentConfig(): Promise<string | null> {
  const result = await db
    .select()
    .from(agentConfig)
    .where(eq(agentConfig.id, 1))
    .limit(1);
  return result[0]?.prompt ?? null;
}

export async function updateAgentConfig(prompt: string) {
  await db
    .update(agentConfig)
    .set({ prompt, updatedAt: new Date() })
    .where(eq(agentConfig.id, 1));
  revalidatePath('/settings');
}
