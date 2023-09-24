import Image from "next/image";
import Logo from '@assets/images/patientmgmt.png'
import GoogleSignIn from "@components/googleSignIn";
const Home = () => {
  return (
    <section className='min-h-[80vh] w-full sm:w-[90%] flex flex-col sm:flex-row justify-start px-6 py-8'>
        <div className="w-full sm:w-[60%] flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
          <h1 className="font-medium text_wrap_balance">
            WELCOME TO PATIENT MANAGER
          </h1>
          <h4 className="font-light text_wrap_balance">
            Keep track of your patient visits, diagnosis and treatment.
          </h4>
          <div className="mt-8">
           <GoogleSignIn/>
          </div>
        </div>
        <div className="w-full sm:w-[40%]">

        </div>
        <div />
    </section>
  )
}

export default Home;