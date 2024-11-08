import { IoIosAdd } from "react-icons/io";

const Dropzone = ({
  setSelectedImage,
}: {
  setSelectedImage: (file?: File) => void;
}) => {
  return (
    <div className="mt-16">
      <input
        onChange={(e) => setSelectedImage(e.target.files?.[0])}
        className="hidden"
        type="file"
        id="file-upload"
        accept="image/*"
      />
      <label
        htmlFor="file-upload"
        className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-[#F0EFEF] bg-white px-10 py-10"
      >
        <div className="absolute inset-3 rounded-xl border border-dashed border-[#F0EFEF]"></div>
        <p>Upload file</p>
        <svg
          width="47"
          height="47"
          viewBox="0 0 47 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41.125 23.5V37.2083C41.125 38.2471 40.7124 39.2433 39.9778 39.9778C39.2433 40.7124 38.2471 41.125 37.2083 41.125H9.79167C8.7529 41.125 7.75668 40.7124 7.02216 39.9778C6.28765 39.2433 5.875 38.2471 5.875 37.2083V9.79167C5.875 8.7529 6.28765 7.75668 7.02216 7.02216C7.75668 6.28765 8.7529 5.875 9.79167 5.875H23.5"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31.3333 9.79167H43.0833"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M37.2083 3.91667V15.6667"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.625 21.5417C19.7881 21.5417 21.5417 19.7881 21.5417 17.625C21.5417 15.4619 19.7881 13.7083 17.625 13.7083C15.4619 13.7083 13.7083 15.4619 13.7083 17.625C13.7083 19.7881 15.4619 21.5417 17.625 21.5417Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M41.125 29.375L35.0816 23.3316C34.3471 22.5973 33.3511 22.1848 32.3125 22.1848C31.2739 22.1848 30.2779 22.5973 29.5434 23.3316L11.75 41.125"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </label>
    </div>
  );
};

export default Dropzone;
