import { UserPlusIcon } from '@heroicons/react/20/solid'
import SearchBar from '@components/searchBar'
import ListByName from '@components/ListByName'
const Dashboard = () => {
  return (
    <div className='glass w-full sm:w-[80%] p-4 sm:p-9 flex flex-col justify-center items-center gap-12 min-h-[400px]'>
        <button
        type='button'
        className='card_on_glass flex justify-center w-72 hover:w-96 max-w-[100%] items-center gap-2 px-4 py-[9px] rounded-lg'
        >
            <UserPlusIcon width={30} height={30} className='text_primary'/>
            <span className='text_on_glass'>Add patient</span>
        </button>
        <SearchBar />
        <ListByName />
    </div>
  )
}

export default Dashboard