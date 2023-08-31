import Image from "next/image";
import Logo from '@assets/images/patientmgmt.png'
const Home = () => {
  return (
    <section className='glass w-full sm:w-[80%] flex flex-col justify-between items-center px-6 py-8'>
        
        <Image
          src={Logo}
          alt="Logo"
          height={40}
          width={110}
          style={{ minHeight: '40px', minWidth: '110px', boxShadow: '1px 3px 7px 0px #183c37'}}
          className='px-3 py-1 bg-white rounded-full'
        />
        <div className="flex flex-col justify-center items-center">
        <h1 className='text_on_glass text-2xl font-normal'>
          Welcome!
        </h1>

        <h2 className="text_on_glass">
          Please Sign in to continue
        </h2>
        </div>
        <div />
    </section>
  )
}

export default Home;