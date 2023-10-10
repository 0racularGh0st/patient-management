"use client";
import { Loader2, CheckCircle, UserX, UserPlusIcon, ArrowLeft } from "lucide-react"
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Patient } from "./types";
import { addPatientValidation } from "./validationSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@components/ui/button";
import { typographyClass } from "@utils/typographyClasses";
import { Textarea } from "@components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"
import { useSession } from 'next-auth/react'


export const AddPatientForm = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const resolver = { resolver: yupResolver(addPatientValidation) };
    const form = useForm<Patient>({
        mode: 'onSubmit',
        ...resolver,
        defaultValues: {
            name: '',
            age: undefined,
            complaint: '',
            provisionalDiagnosis: '',
            treatment: '',
            investigations: '',
            weight: undefined,
            dateOfVisit: '',
            address: '',
            phoneNo: '',
            sex: '',
        }
    });
    const { toast } = useToast();
    const onSubmit: SubmitHandler<Patient> = async (data, e) => {
        e?.preventDefault();
        setIsSubmitting(true);
        const dataWithDate: Patient = { ...data, dateOfVisit: new Date().toString()}
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
            const response = await fetch('api/patient/new', {
                method: 'POST',
                body: JSON.stringify({ ...dataWithDate })
            })
            if (response.ok) {
                setIsSubmitting(false);
                toast({
                    description: <div className="flex justify-start items-center gap-2"><CheckCircle className="text-green-500" /><p className={`${typographyClass['p']} font-semibold text-base`}>Patient has been created successfully!</p></div>,
                    duration: 5000,
                })
                router.push('/dashboard');
                return;
            }
            toast({
                description: <div className="flex justify-start items-center gap-2"><UserX className="text-red-500" /><p className={`${typographyClass['p']} font-semibold text-base`}>Failed to add patient!</p></div>,
                variant: "destructive",
                duration: 5000,
            })
            setIsSubmitting(false);
        } catch(error) {
            console.log(error)
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex flex-col gap-8 mt-2 w-[800px] pb-12 max-w-[calc(100vw-32px)]">
        <Button
            className="mb-1 mt-4 flex justify-start items-center gap-2 md:sticky md:top-[64px] text-slate-500 w-fit"
            variant="ghost"
            onClick={() => router.push("/dashboard")}
        >
            <ArrowLeft />
            Back
        </Button>
        <div>
            <h3 className={typographyClass['h3']}>Add new patient</h3>
        </div>
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Fullname</FormLabel>
                                <FormControl>
                                    <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); } } placeholder="Fullname" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <div className="flex gap-4 flex-wrap w-full justify-between">
                        <FormField
                            control={form.control}
                            name="sex"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(33%-8px)]">
                                    <FormLabel className="font-semibold">Sex</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(33%-8px)]">
                                    <FormLabel className="font-semibold">Age</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); } } placeholder="Age" {...field} type="number" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(33%-8px)]">
                                    <FormLabel className="font-semibold">Weight (in Kgs)</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); } } placeholder="Weight" {...field} type="number" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className="flex gap-4 flex-wrap w-full">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Address</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); } } placeholder="Address" {...field} type="text" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Phone no</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); } } placeholder="Phone number" {...field} type="text" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className="flex gap-4 flex-wrap w-full">
                        <FormField
                            control={form.control}
                            name="complaint"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Complaint</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Complaint" {...field} className="resize-none" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="provisionalDiagnosis"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Provisional Diagnosis</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Provisional Diagnosis" {...field} className="resize-none" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <div className="flex gap-4 flex-wrap w-full">
                        <FormField
                            control={form.control}
                            name="treatment"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Treatment</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Treatment" {...field} className="resize-none" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="investigations"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-[calc(50%-8px)]">
                                    <FormLabel className="font-semibold">Investigations</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Investigations" {...field} className="resize-none" value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="float-right">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlusIcon width={20} height={20} className='mr-2 h-4 w-4' />}
                        Add patient
                    </Button>
                </form>
            </Form>
        </div></div>
    )
}

export default AddPatientForm;