// import React from "react";

// export default function CourseBanner({ title, description, teacherName, bannerImageUrl }) {
//   return (
//     <div className="w-full rounded-lg shadow-md overflow-hidden">
//       {/* Banner Image */}
//       <img
//         src={bannerImageUrl}
//         alt={title}
//         className="w-full h-64 object-cover"
//       />

//       {/* Banner Content */}
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
//         <p className="mt-2 text-gray-600">{description}</p>
//         <p className="mt-4 text-gray-700 font-semibold">Instructor: {teacherName}</p>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function CourseBanner({ title, description, teacherName, bannerImageUrl }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-stretch w-full  overflow-hidden">
      {/* Left: Banner Image */}
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src={bannerImageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-center p-6 md:w-1/2">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{title}</h1>
        <p className="mt-4 text-gray-600 text-sm md:text-base">{description}</p>
        <p className="mt-6 text-gray-700 font-semibold text-sm md:text-lg">
          Instructor: {teacherName}
        </p>
      </div>
    </div>
  );
}
