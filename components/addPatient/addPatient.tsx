"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@components/ui/button"
import UserPlusIcon from "@heroicons/react/20/solid/UserPlusIcon"
import { typographyClass } from "@utils/typographyClasses"
import AddPatientForm from "./addPatientForm"
const AddPatient = (props: { onSuccess: () => void}) => {
  const { onSuccess } = props;
  const [open, setFormOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setFormOpen} modal>
      <DialogTrigger asChild>
      <Button
        type='button'
        onClick={() => setFormOpen(true)}
        className="shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
        >
            <UserPlusIcon width={24} height={24} className='mr-2' />
            <p className={typographyClass['p']}>Add patient</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-32px)]" style={{ width : '800px' }}>
        <AddPatientForm setFormOpen={setFormOpen} onSuccess={onSuccess}/>
      </DialogContent>
    </Dialog>
  )
}

export default AddPatient