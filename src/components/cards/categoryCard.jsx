import React , {useState , useEffect} from "react"

import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as BiIcons from 'react-icons/bi';

export default function CategoryCard({
 category , icon , handleCategory , activeCategory
}
) {
    
const [Active, setActive] = useState(false);

const PhysicsIcon = GiIcons["GiAtom"];
const ScienceIcon = GiIcons["GiMaterialsScience"];
const MathIcon = BiIcons["BiMath"];
const BiologyIcon = BiIcons["BiDna"];
const LanguageIcon = FaIcons["FaLanguage"];


useEffect(() => {
    if (category == activeCategory) {
        setActive(true)
    }else{
        setActive(false)
    }
}, [activeCategory]);

    return(
        <button
        className={` py-2 px-3 text-sm border  rounded-full flex items-center gap-x-1 hover:border-pink-700 transition ${Active? " border-pink-700 ": "border-slate-200"} bg-pink-200/20 text-pink-800`} 
        type="button"
        onClick={()=>{handleCategory(category)}}
      >
        {  
        {
          'All': null,
          'Arabic': <LanguageIcon size={20} />,
          'English': <LanguageIcon size={20} />,
          'French': <LanguageIcon size={20} />, 
          'Science': <ScienceIcon size={20} />, 
          'Physics': <PhysicsIcon size={20} />, 
          'Biology': <BiologyIcon size={20} />, 
          'Maths': <MathIcon size={20} />
        }[category]
      }
        
        <div className="truncate">
          {category}
        </div>
      </button>
    )
}