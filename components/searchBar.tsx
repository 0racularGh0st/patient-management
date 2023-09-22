const SearchBar = () => {
  return (
    <div className='max-w-[100%]'>
        <div className="w-72 hover:w-96 focus:w-96 active:w-96 focus-visible:w-96 focus-within:w-96 max-w-[100%] card_on_glass relative flex items-center h-12 rounded-lg focus-within:shadow-lg overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#38abab">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input
            className="text_on_glass peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
            type="text"
            id="search"
            placeholder="Search by name..." /> 
        </div>
    </div>
  )
}

export default SearchBar;