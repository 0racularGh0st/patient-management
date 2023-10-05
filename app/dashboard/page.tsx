"use client";
import SearchBar from '@components/searchBar'
import ListByName from '@components/ListByName'
import AddPatient from '@components/addPatient/addPatient';
const Dashboard = () => {
  return (
    <div>
      <div className='h-[50%] p-4 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-12 min-h-[400px] flex-wrap m-auto w-full'>
        <AddPatient />
        <SearchBar />
        <ListByName />
      </div>
    </div>
  )
}

export default Dashboard