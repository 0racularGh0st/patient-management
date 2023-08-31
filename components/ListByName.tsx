const ListByName = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return (
    <div className="w-96 max-w-[100%] card_on_glass p-4 sm:p-6 flex flex-col justify-center items-center">
        <h3 className="text_on_glass font-medium">
            List patients by letter
        </h3>
        <div className="w-full mt-6 letter_grid">
            {letters.map((letter) => 
                <button
                    className="card_on_glass w-6 letter_box h-6 cursor-pointer"
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