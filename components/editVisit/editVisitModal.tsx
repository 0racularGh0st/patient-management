"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, CheckCircle, UserX, Save, X } from "lucide-react";
import { EditVisitData, EditVisitProps } from "./types";
import { editVisitValidation } from "./validationSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { typographyClass } from "@/utils/typographyClasses";

export const EditVisitModal = ({ visit, patientId, visitIndex, isOpen, onClose, onSuccess }: EditVisitProps) => {
    const { status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<EditVisitData>({
        resolver: yupResolver(editVisitValidation),
        defaultValues: {
            complaint: visit.complaint || '',
            provisionalDiagnosis: visit.provisionalDiagnosis || '',
            treatment: visit.treatment || '',
            investigations: visit.investigations || '',
            weight: visit.weight || undefined,
        }
    });

    const onSubmit: SubmitHandler<EditVisitData> = async (data, e) => {
        e?.preventDefault();
        setIsSubmitting(true);
        
        if (status !== 'authenticated') {
            toast({
                description: (
                    <div className="flex justify-start items-center gap-2">
                        <UserX className="text-red-500" />
                        <p className={`${typographyClass['p']} font-semibold text-base`}>
                            Logged out, please login again!
                        </p>
                    </div>
                ),
                variant: "destructive",
                duration: 2000,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/patient/visit/edit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    patientId,
                    visitIndex,
                    ...data 
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    description: (
                        <div className="flex justify-start items-center gap-2">
                            <CheckCircle className="text-green-500" />
                            <p className={`${typographyClass['p']} font-semibold text-base`}>
                                Visit updated successfully!
                            </p>
                        </div>
                    ),
                    duration: 3000,
                });
                onSuccess();
                onClose();
            } else {
                toast({
                    description: (
                        <div className="flex justify-start items-center gap-2">
                            <UserX className="text-red-500" />
                            <p className={`${typographyClass['p']} font-semibold text-base`}>
                                {result.message || 'Failed to update visit!'}
                            </p>
                        </div>
                    ),
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Error updating visit:', error);
            toast({
                description: (
                    <div className="flex justify-start items-center gap-2">
                        <UserX className="text-red-500" />
                        <p className={`${typographyClass['p']} font-semibold text-base`}>
                            An error occurred while updating visit!
                        </p>
                    </div>
                ),
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-32px)]" style={{ width: '800px' }}>
                <DialogHeader>
                    <DialogTitle>Edit Visit Details</DialogTitle>
                    <DialogDescription>
                        Update the visit information. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(33%-8px)]">
                                    <FormLabel className="font-semibold">Weight (in Kgs)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            placeholder="Weight" 
                                            {...field} 
                                            value={field.value || ''}
                                            onKeyDown={(event) => { 
                                                if (event.key === 'Enter') event.preventDefault(); 
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex gap-4 flex-wrap w-full">
                            <FormField
                                control={form.control}
                                name="complaint"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Complaint</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Complaint" 
                                                {...field} 
                                                className="resize-none" 
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="provisionalDiagnosis"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Provisional Diagnosis</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Provisional Diagnosis" 
                                                {...field} 
                                                className="resize-none" 
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="flex gap-4 flex-wrap w-full">
                            <FormField
                                control={form.control}
                                name="treatment"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Treatment</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Treatment" 
                                                {...field} 
                                                className="resize-none" 
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="investigations"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Investigations</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Investigations" 
                                                {...field} 
                                                className="resize-none" 
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <DialogFooter className="gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditVisitModal;
