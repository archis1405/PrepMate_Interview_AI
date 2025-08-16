"use client"

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { JSX, useEffect, useState } from 'react';
import QuestionsSection from './components/QuestionSection';
import RecordAnsSection from './components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, StopCircle } from 'lucide-react';

interface Question {
    ques: string;
    ans: string;
}

interface InterviewData {
    id: number;
    jsonMockResp: string;
    jobPosition: string;
    techStacks: string;
    jobDescription: string;
    jobExperience: string;
    createdBy: string;
    createdAt: Date;
    mockId: string;
}

interface StartInterviewParams {
    interviewId: string;
}

interface StartInterviewProps {
    params: StartInterviewParams;
}

interface ParsedJsonResponse {
    interview_questions?: Question[];
    interviewQuestions?: Question[];
    [key: string]: any;
}

function StartInterview({ params }: StartInterviewProps): JSX.Element {
    const [interviewData, setInterviewData] = useState<InterviewData | undefined>();
    const [mockInterviewQues, setMockInterviewQues] = useState<Question[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

    useEffect(() => {
        console.log("🔄 Updated mockInterviewQues:", mockInterviewQues);
    }, [mockInterviewQues]); 

    useEffect(() => {
        getInterviewDetails();
        console.log("mockInterviewQues after fetching:", mockInterviewQues);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getInterviewDetails = async (): Promise<void> => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
    
            if (!result || result.length === 0) {
                console.error("❌ No interview data found");
                return;
            }
    
            console.log("✅ Raw DB Result:", result);
    
            const jsonMockResp: ParsedJsonResponse = JSON.parse(result[0].jsonMockResp || "{}");
            console.log("🛠 Parsed JSON Response:", jsonMockResp);
            console.log("🛠 Type of jsonMockResp:", typeof jsonMockResp);
    
            // 🔥 Dynamically detect the key
            const key = jsonMockResp.interview_questions ? "interview_questions" : "interviewQuestions";
            console.log(`🔍 Using Key: ${key}`);
    
            const extractedQuestions = jsonMockResp[key] || []; 
            console.log("✅ Extracted Questions:", extractedQuestions);
    
            setMockInterviewQues(Array.isArray(extractedQuestions) ? extractedQuestions : []);
            setInterviewData(result[0]);
        } catch (error) {
            console.error("❌ Error fetching interview details:", error);
        }
    };

    const handlePreviousQuestion = (): void => {
        setActiveQuestionIndex(activeQuestionIndex - 1);
    };

    const handleNextQuestion = (): void => {
        setActiveQuestionIndex(activeQuestionIndex + 1);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-700 via-black to-slate-800 text-white overflow-hidden">
            <div className="container mx-auto px-6 py-10 h-full overflow-auto">
                <div className='flex flex-col md:grid md:grid-cols-2 gap-12 h-full'>
                    {/* Questions Section - Always First on Mobile */}
                    <div className='order-1 md:order-none mt-6'>
                        <QuestionsSection 
                            mockInterviewQues={mockInterviewQues}
                            activeQuestionIndex={activeQuestionIndex}
                            onQuestionChange={setActiveQuestionIndex}
                        />
                    </div>

                    {/* Recording Section - Second on Mobile */}
                    <div className='order-2 md:order-none'>
                        {interviewData && (
                            <RecordAnsSection
                                mockInterviewQues={mockInterviewQues}
                                activeQuestionIndex={activeQuestionIndex}
                                interviewData={interviewData}
                            />
                        )}
                    </div>

                    {/* Navigation Buttons - Always Last on Mobile */}
                    <div className='order-3 md:order-none mt-6 md:-mt-2'>
                        <div className='flex justify-end space-x-4 mb-6'>
                            {activeQuestionIndex > 0 && (
                                <Button 
                                    onClick={handlePreviousQuestion}
                                    className='bg-transparent border-white/20 text-white hover:bg-white/10 flex items-center space-x-2'
                                >
                                    <ArrowLeft size={16} />
                                    <span>Previous</span>
                                </Button>
                            )}
                            
                            {activeQuestionIndex < mockInterviewQues?.length - 1 && (
                                <Button 
                                    onClick={handleNextQuestion}
                                    className='bg-gradient-to-r from-cyan-500 to-blue-500 
                                    hover:from-cyan-600 hover:to-blue-600 
                                    flex items-center space-x-2'
                                >
                                    <span>Next</span>
                                    <ArrowRight size={16} />
                                </Button>
                            )}
                            
                            <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                                <Button 
                                    className='bg-red-500/20 border-red-500/30 
                                    hover:bg-red-500/40 text-red-400 
                                    flex items-center space-x-2'
                                >
                                    <StopCircle size={16} />
                                    <span>End</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartInterview;