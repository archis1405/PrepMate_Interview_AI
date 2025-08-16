import { db } from './db';
import { MockInterview, UserAnswer } from './schema';
import { eq } from 'drizzle-orm';

interface DeleteInterviewResult {
  success: boolean;
  error?: unknown;
}

export async function deleteInterview(mockId: string): Promise<DeleteInterviewResult> {
  try {
    // First, delete associated user answers
    await db.delete(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, mockId));
    
    // Then delete the interview
    await db.delete(MockInterview)
      .where(eq(MockInterview.mockId, mockId));
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting interview:", error);
    return { success: false, error };
  }
}