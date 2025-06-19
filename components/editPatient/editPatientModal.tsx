/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, CheckCircle, UserX, Save, X } from "lucide-react";
import { EditPatientData, EditPatientProps } from "./types";
import { editPatientValidation } from "./validationSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

export const EditPatientModal = ({ patient, isOpen, onClose, onSuccess }: EditPatientProps) => {
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<EditPatientData>({
        resolver: yupResolver(editPatientValidation),
        defaultValues: {
            name: patient.name || '',
            ageYears: patient.ageYears || 0,
            ageMonths: patient.ageMonths || 0,
            address: patient.address || '',
            phoneNo: patient.phoneNo || '',
        }
    });

    const onSubmit: SubmitHandler<EditPatientData> = async (data, e) => {
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
            const response = await fetch('/api/patient/edit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: patient._id,
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
                                Patient details updated successfully!
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
                                {result.message || 'Failed to update patient details!'}
                            </p>
                        </div>
                    ),
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            toast({
                description: (
                    <div className="flex justify-start items-center gap-2">
                        <UserX className="text-red-500" />
                        <p className={`${typographyClass['p']} font-semibold text-base`}>
                            An error occurred while updating patient details!
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Patient Details</DialogTitle>
                    <DialogDescription>
                        Update the patient's basic information. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Full Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter full name" 
                                            {...field} 
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex gap-4 flex-wrap w-full">
                            <FormField
                                control={form.control}
                                name="ageYears"
                                render={({ field }) => (
                                    <FormItem className="w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Age (Years)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Years"
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

                            <FormField
                                control={form.control}
                                name="ageMonths"
                                render={({ field }) => (
                                    <FormItem className="w-[calc(50%-8px)]">
                                        <FormLabel className="font-semibold">Age (Months)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Months"
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
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Address</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter address" 
                                            {...field} 
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter phone number" 
                                            {...field} 
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
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

export default EditPatientModal;
