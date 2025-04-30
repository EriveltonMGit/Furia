import Link from "next/link";


export default function Header() {
  return (
    <header
  className="container fixed mx-auto top-2 px-[10px] py-[20px] flex justify-between items-center
    z-90 w-[90%] h-[7vh] sm:h-[5vh] border border-gray-600 bg-white/10 backdrop-blur-md rounded-lg left-0 right-0"
>
      <div className="flex items-center gap-2">
        <img src="/img/logo.png" alt="FURIA Logo" className=" w-7" />
        {/* <h1 className="text-2xl font-bold hidden md:block">
          Furia conheça seu fã
        </h1> */}
      </div>
      <div className="flex gap-4 ">
        <button className="bg-[#00FF00] border-[#00FF00] text-[#ffffff] hover:bg-[#00FF00]/10 px-4 py-1 text-sm rounded-lg border-2 transition-all duration-300 ease-in-out transform ">
          <Link href="/login">Login</Link>
        </button>

        <button className="bg-[#00FF00] hover:bg-[#00CC00] text-black px-4  text-sm rounded-lg border-2 border-[#00FF00] transition-all duration-300 ease-in-out transform ">
          <Link href="/register">Cadastrar</Link>
        </button>
      </div>
    </header>
  );
}
