"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@components/ui/button"
import { PlusIcon } from "lucide-react"
import AddVisitForm from "./addVisitForm"
const AddVisit = (props: { id: string, onSuccess: () => void}) => {
  const { id, onSuccess } = props;
  const [open, setFormOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setFormOpen} modal>
      <DialogTrigger asChild>
      <Button
        type='button'
        onClick={() => setFormOpen(true)}
        className="hover:shadow-md transition-shadow duration-200 ease-in-out"
        >
            <PlusIcon className="mr-2 w-5 h-5" />
            <span className="text-[14px] font-semibold">Add Visit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-32px)]" style={{ width: '800px', zIndex: 9999999, maxHeight: '100dvh', overflow: 'scroll' }}>
        <AddVisitForm setFormOpen={setFormOpen} id={id} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export default AddVisit;