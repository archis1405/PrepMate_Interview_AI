import { Lightbulb, Volume2 } from 'lucide-react';
import React, { useState } from 'react'

interface Question {
    ques: string;
    ans?: string;
}

interface QuestionsSectionProps {
    mockInterviewQues: Question[];
    activeQuestionIndex: number;
    onQuestionChange?: (index: number) => void;
}

function QuestionsSection({ 
    mockInterviewQues, 
    activeQuestionIndex, 
    onQuestionChange 
}: QuestionsSectionProps) {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    
    const textToSpeech = (text: string): void => {
        if('speechSynthesis' in window){
            const msg = new SpeechSynthesisUtterance(text);
            msg.onstart = () => setIsSpeaking(true);  
            msg.onend = () => setIsSpeaking(false);   
            window.speechSynthesis.speak(msg);
        }
        else{
            alert('Sorry! Your browser does not support text-to-speech');
        }
    }
    
    const handleQuestionChange = (index: number): void => {
        if (onQuestionChange) {
            onQuestionChange(index);
        }
    }

    const handleSpeechClick = (): void => {
        const currentQuestion = mockInterviewQues[activeQuestionIndex]?.ques;
        if (currentQuestion) {
            textToSpeech(currentQuestion);
        }
    }

    if (!mockInterviewQues || mockInterviewQues.length === 0) {
        return null;
    }

    return (
        <div className='mt-10 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {mockInterviewQues.map((question, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleQuestionChange(index)}
                        className={`
                            p-2 
                            rounded-xl 
                            text-center 
                            cursor-pointer 
                            transition-all 
                            duration-300 
                            focus:outline-none
                            ${activeQuestionIndex === index 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'}
                        `}
                    >
                        <span className='text-sm font-light'>
                            Question #{index + 1}
                        </span>
                    </button>
                ))}
            </div>
            
            <div className='space-y-4'>
                <h2 className='text-xl font-bold 
                    bg-clip-text text-transparent 
                    bg-gradient-to-r from-cyan-300 to-blue-500'>
                    Q. {mockInterviewQues[activeQuestionIndex]?.ques}
                </h2>
                
                <div 
                    className='inline-block cursor-pointer 
                    bg-white/10 p-2 rounded-full 
                    hover:bg-white/20 transition-all'
                    onClick={handleSpeechClick}
                >
                    {isSpeaking ? 
                        <Volume2 className="animate-pulse text-blue-400" /> : 
                        <Volume2 className='text-blue-400' />
                    }
                </div>
            </div>
            
            <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                    <Lightbulb className='text-yellow-500' />
                    <h2 className='text-xl font-bold text-yellow-500'>
                        Important Information
                    </h2>
                </div>
                <p className='text-sm mb-3 text-yellow-300'>
                    Enable your webcam and microphone for the AI-powered mock interview. 
                    This session includes 10 questions to help assess and improve your interview skills.
                </p>
                <p className='text-xs text-yellow-600'>
                    <strong>Note:</strong> Your privacy is our priority. We do not record or store any personal data. 
                    Give a buffer time of 2 seconds before and after clicking on the Record Box.
                </p>
            </div>
        </div>
    )
}

export default QuestionsSection