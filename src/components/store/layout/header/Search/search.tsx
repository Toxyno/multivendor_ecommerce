import { Search as SearchIcon } from "lucide-react";

const search = () => {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-white relative border-none flex">
        <input
          type="text"
          placeholder="Seach..."
          className=" bg-white text-black flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className="border-[1px] rounded-[20px] w-[56px] h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-t from-slate-500 to bg-slate-600 grid place-items-center"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default search;
