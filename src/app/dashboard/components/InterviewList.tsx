"use client"

import { db } from '@/utils/db';
import { MockInterview, type MockInterviewSelect } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { Zap, PlusCircle } from 'lucide-react';
import AddNewInterview from './AddNewInterview';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState<MockInterviewSelect[]>([]);
    
    useEffect(() => {
        if (user) {
            getInterviewList();
        }
    }, [user]);
    
    const getInterviewList = async (): Promise<void> => {
        if (!user?.primaryEmailAddress?.emailAddress) {
            return;
        }

        try {
            const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(MockInterview.id));
            
            console.log(result);
            setInterviewList(result);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        }
    };

    const handleDeleteInterview = (deletedMockId: string): void => {
        // Remove the deleted interview from the list
        setInterviewList(prevList => 
            prevList.filter(interview => interview.mockId !== deletedMockId)
        );
    };
    
    return (
        <div className='space-y-6'>
            <div className='flex items-center space-x-4'>
                <Zap 
                    className="text-blue-400" 
                    size={30} 
                />
                <h2 className='text-2xl font-bold 
                    bg-clip-text text-transparent 
                    bg-gradient-to-r from-cyan-300 to-blue-500'>
                    Previous Mock Interviews
                </h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'>
                {interviewList?.length === 0 ? 
                    <div className='col-span-full text-center py-12'>
                        <h1 className='text-4xl font-bold text-gray-600 
                            bg-clip-text text-transparent 
                            bg-gradient-to-r from-pink-500 to-purple-500'>
                            No Previous Interviews Found
                        </h1>
                        <p className='text-gray-400 mt-4'>
                            Click on the Button on the left to get started
                        </p>
                    </div>
                    :
                    interviewList?.map((interview, index) => (
                        <InterviewItemCard 
                            key={interview.mockId || index} 
                            interview={{
                                mockId: interview.mockId,
                                jobPosition: interview.jobPosition,
                                jobExperience: interview.jobExperience,
                                techStacks: interview.techStacks,
                                createdAt: typeof interview.createdAt === 'string' 
                                    ? interview.createdAt 
                                    : interview.createdAt?.toLocaleDateString() || ''
                            }}
                            onDelete={handleDeleteInterview}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default InterviewList