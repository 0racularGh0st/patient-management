import { UserPlusIcon } from '@heroicons/react/20/solid'
const Dashboard = () => {
  return (
    <div className='flex flex-col gap-12'>
        <button
        type='button'
        className='flex justify-center items-center gap-2 shadow-md hover:shadow-xl transition duration-400 rounded-full px-4 py-2'
        >
            <UserPlusIcon width={30} height={30} className='text_primary'/>
            <span className='text_secondary'>Add patient</span>
        </button>
    </div>
  )
}

export default Dashboard