"use client"

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic, StopCircle, CameraOff, Edit, Check, Camera } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { toast } from 'sonner';

// Extended Window interface for speech recognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface Question {
    ques: string;
    ans: string;
}

interface InterviewData {
    mockId: string;
    [key: string]: any;
}

interface RecordAnsSectionProps {
    mockInterviewQues: Question[];
    activeQuestionIndex: number;
    interviewData: InterviewData;
}

interface FeedbackResponse {
    feedback?: string;
    rating?: string;
}

function RecordAnsSection({ 
    mockInterviewQues, 
    activeQuestionIndex, 
    interviewData 
}: RecordAnsSectionProps) {
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [editableAnswer, setEditableAnswer] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [webcamEnabled, setWebcamEnabled] = useState<boolean>(true);
    const recognitionRef = useRef<any>(null);
    const transcriptRef = useRef<string>('');
    const webcamRef = useRef<Webcam>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && !recognitionRef.current) {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                
                if (!SpeechRecognition) {
                    console.error("❌ Speech Recognition not supported in this browser");
                    toast.error("Speech recognition not supported in your browser");
                    return;
                }
                
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                
                recognitionRef.current.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = 0; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript + ' ';
                    }
                    
                    console.log("🎙 Speech Result:", transcript);
                    transcriptRef.current = transcript.trim();
                    
                    setUserAnswer(transcript.trim());
                };
                
                recognitionRef.current.onerror = (event: any) => {
                    console.error("❌ Speech Recognition Error:", event.error);
                    if (event.error === 'no-speech') {
                        console.log("No speech detected");
                    } else {
                        toast.error(`Speech recognition error: ${event.error}`);
                    }
                };
                
                recognitionRef.current.onend = () => {
                    console.log("🔄 Speech Recognition Ended");
                    
                    if (isRecording) {
                        console.log("🔄 Auto-restarting recognition");
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error("Failed to restart recognition:", e);
                        }
                    }
                };
                
                console.log("🎤 Speech Recognition initialized successfully");
            } catch (error) {
                console.error("❌ Failed to initialize speech recognition:", error);
                toast.error("Failed to initialize speech recognition");
            }
        }
    }, [isRecording]);

    // Request microphone permission on component mount
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => console.log("🎙️ Mic Permission Granted"))
            .catch((err: Error) => {
                console.error("❌ Mic Permission Denied:", err);
                toast.error("Microphone access denied. Please check your browser permissions.");
            });
    }, []);

    const toggleWebcam = (): void => {
        if (webcamRef.current && webcamEnabled) {
            const mediaStream = webcamRef.current.stream;
            if (mediaStream) {
                const tracks = mediaStream.getTracks();
                tracks.forEach(track => track.stop());
            }
        }
        setWebcamEnabled(!webcamEnabled);
    };

    const startRecording = (): void => {
        if (recognitionRef.current) {
            try {
                console.log("🎤 Starting recording...");
                transcriptRef.current = '';
                setUserAnswer('');
                recognitionRef.current.start();
                setIsRecording(true);
                toast.success("Recording started");
            } catch (error) {
                console.error("❌ Failed to start recording:", error);
                toast.error("Failed to start recording");
            }
        } else {
            toast.error("Speech recognition not available");
        }
    };

    const stopRecording = (): void => {
        if (recognitionRef.current && isRecording) {
            try {
                console.log("🛑 Stopping recording...");
                recognitionRef.current.stop();
                setIsRecording(false);
                
                const finalTranscript = transcriptRef.current;
                
                if (finalTranscript && finalTranscript.trim().length > 5) {
                    setUserAnswer(finalTranscript);
                    setEditableAnswer(finalTranscript);
                    setIsEditing(true);
                } else {
                    toast.error("No speech detected or answer too short");
                }
            } catch (error) {
                console.error("❌ Failed to stop recording:", error);
                toast.error("Failed to stop recording");
            }
        }
    };

    const startStopRecording = (): void => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleEditAnswer = (): void => {
        setEditableAnswer(userAnswer);
        setIsEditing(true);
    };

    const handleSaveEditedAnswer = (): void => {
        if (editableAnswer.trim().length < 5) {
            toast.error('Answer is too short');
            return;
        }

        setUserAnswer(editableAnswer);
        setIsEditing(false);
        updateUserAnswer(editableAnswer);
    };

    const handleEditableAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setEditableAnswer(e.target.value);
    };

    const updateUserAnswer = async (finalTranscript: string): Promise<void> => {
        if (!finalTranscript || finalTranscript.trim().length < 5) {
            toast.error('Answer text too short or empty!');
            return;
        }
        
        console.log("Saving answer to database:", finalTranscript);
        toast.info('Processing your answer...');
        setLoading(true);
        
        try {
            const feedbackPrompt = "Question: " + mockInterviewQues[activeQuestionIndex]?.ques +
                ", User Answer: " + finalTranscript +
                ", Depending on question and user answer for given interview question" +
                " Please give us rating for answer and feedback as area of improvement if any. The rating should be upon 5." +
                "In Just 3 to 5 lines to improve it in JSON format with rating field and feedback field." +
                "Strictly follow these JSON rules:1. **Do not include any markdown formatting** (like ```json or ```)." +
                "2. Ensure that all answers are **single-line or properly escaped**." +
                "3. Do **not** use line breaks (\\n) or extra spaces inside the JSON values.";
        
            const result = await chatSession.sendMessage(feedbackPrompt);
            const rawResponse = await result.response.text();
            console.log("Raw Response:", rawResponse);
            
            let parsedResponse: FeedbackResponse;
            try {
                parsedResponse = JSON.parse(rawResponse.trim());
            } catch (e) {
                try {
                    const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
                    if (jsonMatch) {
                        parsedResponse = JSON.parse(jsonMatch[1].trim());
                    } else {
                        throw new Error("Could not parse JSON response");
                    }
                } catch (jsonError) {
                    console.error("JSON parsing failed:", jsonError);
                    parsedResponse = {
                        feedback: "Could not parse feedback. The answer was recorded.",
                        rating: "N/A"
                    };
                }
            }
            
            console.log("Parsed feedback:", parsedResponse);
            
            // Fixed the values object structure to match schema exactly
            const insertData = {
                mockIdRef: interviewData?.mockId || '',
                question: mockInterviewQues[activeQuestionIndex]?.ques || '',
                correctAns: mockInterviewQues[activeQuestionIndex]?.ans || null,
                userAnswer: finalTranscript || null,
                feedback: parsedResponse?.feedback || null,
                rating: parsedResponse?.rating || null,
                userEmail: user?.primaryEmailAddress?.emailAddress || null,
                // Remove createdAt as it has defaultNow() in schema
            };

            // Validate required fields before insertion (only mockIdRef and question are required)
            if (!insertData.mockIdRef || !insertData.question) {
                console.error("Missing required fields:", {
                    mockIdRef: insertData.mockIdRef,
                    question: insertData.question,
                });
                toast.error('Missing required information. Please try again.');
                return;
            }
            
            console.log("Insert data:", insertData);
            
            const resp = await db.insert(UserAnswer).values(insertData);
            
            if (resp) {
                toast.success('User Answer Recorded Successfully!');
                console.log("🎉 Answer saved to database!");
                setUserAnswer('');
                transcriptRef.current = '';
            } else {
                toast.error('⚠️ Failed to save answer to database.');
            }
        } catch (error) {
            console.error("🚨 Error updating user answer:", error);
            toast.error('❌ Something went wrong. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center space-y-4 h-full'>
            {/* Webcam Section */}
            <div className='bg-white/4 backdrop-blur-xl rounded-3xl border border-white/10 p-3 w-full'>
                <div className='relative rounded-2xl overflow-hidden'>
                    {webcamEnabled ? (
                        <Webcam
                            ref={webcamRef}
                            mirrored={true}
                            style={{
                                height: 350,
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: '1rem'
                            }}
                        />
                    ) : (
                        <div className='h-[300px] flex items-center justify-center bg-gray-800 rounded-2xl'>
                            <CameraOff className='text-gray-500' size={64} />
                        </div>
                    )}
                    
                    <div className='absolute top-4 right-4 bg-black/50 rounded-sm'>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={toggleWebcam}
                            className='text-white hover:bg-black/50 hover:text-white'
                        >
                            {webcamEnabled ? <CameraOff size={20} /> : <Camera size={20} />}
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Transcript Display with Editing */}
            {userAnswer && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-full border border-white/10 max-h-48 overflow-y-auto">
                    <div className='flex justify-between items-center mb-2'>
                        <h3 className="text-xl font-bold 
                            bg-clip-text text-transparent 
                            bg-gradient-to-r from-cyan-300 to-blue-500">
                            Your Answer
                        </h3>
                        {!isEditing ? (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleEditAnswer}
                                className='flex items-center space-x-2 text-black'
                            >
                                <Edit size={16} />
                                <span>You can edit after recording</span>
                            </Button>
                        ) : (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSaveEditedAnswer}
                                className='flex items-center space-x-2 font-bold border-green-500 text-green-500 hover:bg-green-500/10 hover:text-white'
                            >
                                <Check size={16} />
                                <span>Done</span>
                            </Button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <textarea
                            value={editableAnswer}
                            onChange={handleEditableAnswerChange}
                            className="w-full bg-white/10 p-3 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    ) : (
                        <p className="text-gray-300 break-words">{userAnswer}</p>
                    )}
                </div>
            )}
            
            {/* Record Button */}
            <Button 
                disabled={loading} 
                className={`
                    w-full 
                    py-6
                    flex items-center justify-center 
                    space-x-3 
                    ${isRecording 
                        ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/40 text-red-400' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'}
                `}
                onClick={startStopRecording}
            >
                {isRecording ? (
                    <>
                        <StopCircle className="animate-pulse" size={24} />
                        <span className='font-bold animate-pulse'>Stop Recording</span>
                    </>
                ) : (
                    <>
                        <Mic size={24} />
                        <span>Record Your Answer</span>
                    </>
                )}
            </Button>
        </div>
    );
}

export default RecordAnsSection;