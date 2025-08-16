"use client"

import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Zap, FileText, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteInterview } from '@/utils/interviewUtils'
import { toast } from 'sonner'

interface Interview {
  mockId: string;
  jobPosition: string;
  jobExperience: string;
  techStacks?: string;
  createdAt: string;
}

interface InterviewItemCardProps {
  interview: Interview;
  onDelete?: (mockId: string) => void;
}

function InterviewItemCard({ interview, onDelete }: InterviewItemCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const onStart = (): void => {
        router.push(`/dashboard/interview/${interview?.mockId}`)
    }

    const onFeedback = (): void => {
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
    }

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true);
        try {
            const result = await deleteInterview(interview?.mockId);
            
            if (result.success) {
                toast.success("Interview deleted successfully");
                if (onDelete) {
                    onDelete(interview?.mockId);
                }
                setIsDialogOpen(false);
            } else {
                toast.error("Failed to delete interview");
            }
        } catch (error) {
            console.error("Deletion error:", error);
            toast.error("An error occurred while deleting the interview");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div 
                className='bg-white/5 
                backdrop-blur-xl 
                border-2 border-transparent 
                hover:border-blue-500/20 
                rounded-2xl 
                p-5
                space-y-4 
                transition-all 
                duration-300 
                transform 
                hover:scale-105 
                hover:shadow-2xl 
                flex 
                flex-col 
                justify-between 
                h-full w-80'
            >
            <div>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold 
                        bg-clip-text text-transparent 
                        bg-gradient-to-r from-cyan-300 to-blue-500'>
                        {interview?.jobPosition}
                    </h2>
                    <h2 className='text-xs text-gray-400 
                        bg-white/10 
                        px-2 py-2
                        rounded-lg'>
                        {interview.jobExperience} years
                    </h2>
                </div>

                <div className='space-y-2'>
                    <p className='text-sm text-gray-300 flex items-center space-x-2'>
                        <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                        <span>Tech Stack: {interview?.techStacks || 'Not specified'}</span>
                    </p>
                    <p className='text-xs text-gray-400 flex items-center space-x-2'>
                        <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                        <span>Created: {interview.createdAt}</span>
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-[1fr_1fr_auto] gap-3 mt-4'>
                    <Button 
                        variant="outline" 
                        className='w-full flex items-center justify-center 
                        bg-transparent border-white/20 text-white 
                        hover:bg-white/10 hover:text-white
                        rounded-md'
                        onClick={onFeedback}
                    >
                        <FileText size={12} className="mr-1" />
                        <span>Feedback</span>
                    </Button>
                    <Button 
                        className='w-full flex items-center justify-center space-x-0
                        bg-gradient-to-r from-cyan-500 to-blue-500 
                        hover:from-cyan-600 hover:to-blue-600
                        py-2 px-2
                        rounded-md'
                        onClick={onStart}
                    >
                        <Zap size={14}/>
                        <span>Start</span>
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                variant="destructive"
                                className='w-auto px-2
                                bg-red-500/20 border-red-500/30 
                                hover:bg-red-500/40 text-red-400
                                rounded-md'
                            >
                                <Trash2 size={16} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-white/10">
                            <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                    <AlertTriangle className="text-yellow-500" size={24} />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
                                        Confirm Deletion
                                    </span>
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Are you sure you want to delete this interview?
                                    This action cannot be undone and will permanently remove 
                                    all associated data.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end space-x-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500/20 border-red-500/30 hover:bg-red-500/40 text-red-400"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Interview'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default InterviewItemCard