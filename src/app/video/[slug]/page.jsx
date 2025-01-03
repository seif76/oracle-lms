import DashboardPage from "@/components/dashbord/studentvideoDashboard";
import NavLayout from "@/components/navigation/navLayout";

import YoutubeIfram from "@/components/cards/youtubeIfram";

export default function Dashboard() {
    //https://youtu.be/Y8G6IHlftgc
    //https://youtu.be/Y8G6IHlftgc
    //https://www.youtube.com/embed/Y8G6IHlftgc?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1
    //https://www.youtube.com/embed/QvlcyoLp8x0?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1
    
  return (
  <NavLayout>
  <div className="flex items-center justify-center"> 
   <YoutubeIfram 
   url={"https://www.youtube.com/embed/Y8G6IHlftgc?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1"}
   title={"title test "}
   category={"test category"}
   />
   
  
</div>
  </NavLayout>
  );
}