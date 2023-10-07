"use client";
import { Loader2, CheckCircle, UserX } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Visit } from "./types";
import { addVisitValidation } from "./validationSchema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@components/ui/button";
import { typographyClass } from "@utils/typographyClasses";
import { Textarea } from "@components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"
import { useSession } from 'next-auth/react'
import { Separator } from "@components/ui/separator";


export const AddVisitForm = ({ setFormOpen, id, onSuccess }: { setFormOpen: Dispatch<SetStateAction<boolean>>, id: string, onSuccess: () => void}) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const resolver = { resolver: yupResolver(addVisitValidation) };
    const form = useForm<Visit>({
        mode: 'onSubmit',
        ...resolver,
        defaultValues: {
            complaint: '',
            provisionalDiagnosis: '',
            treatment: '',
            investigations: '',
            weight: undefined,
            dateOfVisit: '',
        }
    });
    const { toast } = useToast();
    const onSubmit: SubmitHandler<Visit> = async (data, e) => {
        e?.preventDefault();
        setIsSubmitting(true);
        const dataWithDate: Visit & { id: string } = { ...data, dateOfVisit: new Date().toString(), id}
        if (status !== 'authenticated') {
            toast({
                description: <div className="flex justify-start items-center gap-2"><UserX className="text-red-500" /><p className={`${typographyClass['p']} font-semibold text-base`}>Logged out, redirecting to login...!</p></div>,
                variant: "destructive",
                duration: 2000,
            })
            setTimeout(() => router.push('/'), 2000);
            return;
        }
        try {
            const response = await fetch('api/patient/visit', {
                method: 'PATCH',
                body: JSON.stringify({ ...dataWithDate })
            })
            if (response.ok) {
                onSuccess();
                setIsSubmitting(false);
                toast({
                    description: <div className="flex justify-start items-center gap-2"><CheckCircle className="text-green-500" /><p className={`${typographyClass['p']} font-semibold text-base`}>New Visit added successfully!</p></div>,
                    duration: 5000,
                })
                setFormOpen(false);
                return;
            }
            toast({
                description: <div className="flex justify-start items-center gap-2"><UserX className="text-red-500" /><p className={`${typographyClass['p']} font-semibold text-base`}>Failed to add visit!</p></div>,
                variant: "destructive",
                duration: 5000,
            })
            setIsSubmitting(false);
            setFormOpen(false);
        } catch(error) {
            console.log(error)
            setIsSubmitting(false);
            setFormOpen(false);
        }
    }
    return (
        <div>  
            <h3 className={typographyClass['h3']}>Add new Visit <Separator className="mt-1 mb-2"/></h3>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">  
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem className="w-[calc(33%-8px)]">
                        <FormLabel className="font-semibold">Weight (in Kgs)</FormLabel>
                        <FormControl>
                            <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }} placeholder="Weight" {...field} type="number" value={field.value || ''}/>
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
                        <FormItem className="w-[calc(50%-8px)]">
                        <FormLabel className="font-semibold">Complaint</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Complaint" {...field} className="resize-none" value={field.value || ''}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="provisionalDiagnosis"
                    render={({ field }) => (
                        <FormItem className="w-[calc(50%-8px)]">
                        <FormLabel className="font-semibold">Provisional Diagnosis</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Provisional Diagnosis" {...field} className="resize-none" value={field.value || ''}/>
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
                        <FormItem className="w-[calc(50%-8px)]">
                        <FormLabel className="font-semibold">Treatment</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Treatment" {...field} className="resize-none" value={field.value || ''}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="investigations"
                    render={({ field }) => (
                        <FormItem className="w-[calc(50%-8px)]">
                        <FormLabel className="font-semibold">Investigations</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Investigations" {...field} className="resize-none" value={field.value || ''}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                 <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Visit
                </Button>
            </form>
        </Form>
        </div>
    )
}

export default AddVisitForm;