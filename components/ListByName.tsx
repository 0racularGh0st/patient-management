import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";

const ListByName = () => {
  const router = useRouter();
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return (
    <Card>
        <div className="lg:w-96 min-w-[252px] max-w-[100%] px-6 py-3 flex flex-col justify-center items-center letter-comp max_mobile_element">
            <h4 className="text-md font-semibold">
                List patients by letter
            </h4>
            <Separator className='my-2'/>
            <div className="w-full letter_grid letter-comp-content">
                {letters.map((letter) => 
                    <Button
                        variant="ghost"
                        key={letter}
                        onClick={() => router.push(`/patient/list?letter=${letter}`)}
                    >
                        <p>{letter}</p>
                    </Button>
                )}
            </div>
        </div>
    </Card>
  )
}

export default ListByName