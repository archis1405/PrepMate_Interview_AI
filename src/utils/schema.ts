import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const MockInterview = pgTable('mock_interview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
    techStacks: varchar('techStacks', { length: 500 }).notNull(),
    jobDescription: varchar('jobDescription', { length: 1000 }).notNull(),
    jobExperience: varchar('jobExperience', { length: 50 }).notNull(),
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    mockId: varchar('mockId', { length: 255 }).notNull().unique(),
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId', { length: 255 }).notNull(),
    question: varchar('question', { length: 1000 }).notNull(),
    correctAns: text('correctAns'),
    userAnswer: text('userAnswer'),
    feedback: text('feedback'),
    rating: varchar('rating', { length: 10 }),
    userEmail: varchar('userEmail', { length: 255 }),
    createdAt: timestamp('createdAt').defaultNow(),
});

// Type inference for better TypeScript support
export type MockInterviewSelect = InferSelectModel<typeof MockInterview>;
export type MockInterviewInsert = InferInsertModel<typeof MockInterview>;
export type UserAnswerSelect = InferSelectModel<typeof UserAnswer>;
export type UserAnswerInsert = InferInsertModel<typeof UserAnswer>;