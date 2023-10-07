"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ListByName from '@components/ListByName'
import AddPatient from '@components/addPatient/addPatient';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import useInput from '@utils/hooks/useInput';
import useDebounce from '@utils/hooks/useDebounce';
import { PatientStored } from '@components/addPatient/types';
const Dashboard = () => {
  const [keyword, setKeyword] = useInput('');
  const debouncedKeyword = useDebounce<string>(keyword, 500);
  const [patients, setPatients] = useState<Array<PatientStored>>([]);
  const router = useRouter();
  useEffect(() => {
    if(debouncedKeyword) {
      getPatientsByKeyword(debouncedKeyword);
      return;
    }
    setPatients([]);
  }, [debouncedKeyword]);

  const getPatientsByKeyword = async (keyword: string) => {
    const res = await fetch(`/api/patient?keyword=${keyword}`);
    const data = await res.json();
    if ( data?.data) {
      setPatients([...data.data]);
    }
  }
  const handlePatientSelect = (id: string) => {
    router.push(`/patient?id=${id}`);
  }

  return (
    <div>
      <div className='h-[50%] p-4 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-12 min-h-[400px] flex-wrap m-auto w-full'>
        <AddPatient/>
        <Command className='w-72 max-w-[calc(100vw-32px) rounded-lg border shadow-sm' onChange={setKeyword} value={keyword}>
          <CommandInput placeholder="Search by name..." className='h-[40px]'/>
          <CommandList>
            {debouncedKeyword.length > 2 && patients.length === 0 && (
              <CommandEmpty>No patients found!</CommandEmpty>
            )}
            {patients && patients.length > 0 && patients.map((patient, index) => (
              <CommandItem
                key={index}
                className="cursor-pointer hover:text-accent-foreground hover:bg-accent"
                onSelect={() => handlePatientSelect(patient._id)}
              >
                {patient.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
        <ListByName />
      </div>
    </div>
  )
}

export default Dashboard