const SearchBar = () => {
  return (
    <div className='max_mobile_element'>
        <div className="w-72 card_on_glass_effect relative flex items-center h-12 rounded-lg focus-within:shadow-lg overflow-hidden max_mobile_element">
            <div className="grid place-items-center h-full w-16 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 h-min-6 w-min-6" fill="none" viewBox="0 0 24 24" stroke="#38abab">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input
            className="text_on_glass peer h-full w-full outline-none text-gray-700 pr-2 bg-transparent text-base"
            type="text"
            id="search"
            placeholder="Search by name..." /> 
        </div>
    </div>
  )
}

export default SearchBar;