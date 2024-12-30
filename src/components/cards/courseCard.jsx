import axios from "axios";
import React , {useState} from "react"
import Link from "next/link";
import Image from "next/image";

import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as FiIcons from 'react-icons/fi';
import * as CgIcons from 'react-icons/cg';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';




export default function courseCard({
  title, category , imageUrl , id , duration
}
) {
//const [title, settitle] = useState("seif");
//const [imageUrl, setimageUrl] = useState("https://www.codewithantonio.com/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fe6f358fe-6753-4619-8ec4-23cef6f8d135-ui8fxx.jpg&w=1920&q=75");
const [chaptersLength, setchaptersLength] = useState(15);
const [price, setprice] = useState(20);
const [progress, setprogress] = useState("");
//const [category, setcategory] = useState("maths");

const ProfileIcon = CgIcons["CgProfile"];
const BookIcon = BsIcons["BsBook"];
const ClockIcon = BiIcons["BiTimeFive"];



    return(
            
   <Link href={`/lessons/${id}`}>
   <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
     <div className="relative w-full aspect-video rounded-md overflow-hidden">
       <Image
         fill
         className="object-cover"
         alt={title}
         src={`${imageUrl}`}
       />
     </div>
     <div className="flex flex-col pt-2">
       <div className="text-lg md:text-base font-medium group-hover:text-pink-700 transition line-clamp-2">
         {title}
       </div>
       <p className="text-xs text-muted-foreground">
         {category}
       </p>
       <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
         <div className="flex items-center gap-x-1 text-slate-500">
           
         <ClockIcon size={23} />
           <span>
             {
             //chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"
             }
             {duration}
           </span>
         </div>
       </div>
      
         <p className="text-md md:text-sm font-medium text-slate-700">
           {price + " $"}
         </p>
       
     </div>
   </div>
 </Link>
    )
}