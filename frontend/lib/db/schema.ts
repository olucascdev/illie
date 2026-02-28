import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  notionPageId: varchar('notion_page_id', { length: 255 }).unique().notNull(),
  title: text('title'),
  originalContent: text('original_content'),
  linkedinPost: text('linkedin_post'),
  shortPost: text('short_post'),
  hashtags: text('hashtags').array(),
  status: varchar('status', { length: 50 }).default('generated'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const pipelineRuns = pgTable('pipeline_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  flowExecution: varchar('flow_execution', { length: 255 }),
  pagesFound: integer('pages_found').default(0),
  pagesOk: integer('pages_ok').default(0),
  pagesError: integer('pages_error').default(0),
  errorDetail: text('error_detail'),
  executedAt: timestamp('executed_at', { withTimezone: true }).defaultNow(),
});

export const agentConfig = pgTable('agent_config', {
  id: integer('id').primaryKey().default(1),
  prompt: text('prompt').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type AgentConfig = typeof agentConfig.$inferSelect;
