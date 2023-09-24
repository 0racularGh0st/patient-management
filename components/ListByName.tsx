const ListByName = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return (
    <div className="w-96 min-w-[252px] max-w-[100%] card_on_glass_effect px-6 py-3 flex flex-col justify-center items-center letter-comp max_mobile_element">
        <span className="text_on_glass_bold">
            List patients by letter
        </span>
        <div className="w-full letter_grid letter-comp-content">
            {letters.map((letter) => 
                <button
                    className="w-6 letter_box h-6 cursor-pointer"
                    key={letter}
                >
                    <span className="text_on_glass">{letter}</span>
                </button>
            )}
        </div>
    </div>
  )
}

export default ListByName