import GoogleSignIn from "@components/googleSignIn";
import { typographyClass } from "@utils/typographyClasses";
const Home = () => {
  return (
    <section className='min-h-[80vh] w-full sm:w-[90%] flex flex-col sm:flex-row justify-start px-6 py-8'>
        <div className="w-full sm:w-[60%] flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
          <h1 className={`${typographyClass['h3']} text-5xl`}>
            WELCOME TO PATIENT MANAGER
          </h1>
          <p className={`${typographyClass['p']}`}>
            Keep track of your patient visits, diagnosis and treatment.
          </p>
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
