import React, { useState } from "react";
import Link from "next/link";
import * as AiIcons from 'react-icons/ai';
import * as FiIcons from 'react-icons/fi';
import * as CgIcons from 'react-icons/cg';
import * as RxIcons from 'react-icons/rx';
import * as Io5Icons from 'react-icons/io5';
import * as MdIcons from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import EnrollmentByPhone from "@/components/Forms/userAnalysis"; // Modal component import

export default function Navbar() {
  const [toggle, settoggle] = useState(true);
  const [showEnrollment, setShowEnrollment] = useState(false); // State to toggle EnrollmentByPhone visibility

  const LogoutIcon = FiIcons["FiLogOut"];
  const ProfileIcon = CgIcons["CgProfile"];
  const DashboardIcon = RxIcons["RxDashboard"];
  const PricingIcon = Io5Icons["IoPricetagOutline"];
  const FaqIcon = AiIcons["AiOutlineQuestionCircle"];
  const VideoIcon = MdIcons["MdVideoLibrary"];
  const closePopup = () => setShowEnrollment(false);

  const [cookies, setCookie , removeCookie] = useCookies(['jwt']);
  const router = useRouter();

  function handleNavbarMobile() {
    settoggle(!toggle);
  }

  function handleSignOut() {
    removeCookie("jwt");
    alert("fonnee");
    router.push("/login");
  }

  // Toggle the visibility of the EnrollmentByPhone component
  const toggleEnrollmentForm = () => {
    setShowEnrollment(!showEnrollment);
  }

  return (
    <>
      <nav className={`sm:hidden fixed top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link href="/" className="flex  ml-2 md:mr-24">
                <img src="/images/logo/edusphere-logo.png" className=" h-16 ml-[-20px] sm:mr-3 sm:h-7" alt="Oracle Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Oracle</span>
              </Link>
              <button onClick={handleNavbarMobile} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className=" fixed top-[25px] right-[25px] inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside id="default-sidebar" className={`fixed top-0 left-0 z-50 w-64 h-[100%] sm:h-screen transition-transform ${toggle ? "-translate-x-full" : ""} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Link href="/" className="flex items-center sm:pl-2.5 sm:mt-0 mt-3.5 mb-3">
            <img src="/images/logo/oracle-logo.jpeg" className="h-24 pl-4 ml-[-20px] sm:mr-3 sm:h-16" alt="Oracle Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Oracle</span>
          </Link>

          <ul className="border-t border-gray-700 mt-2 space-y-2 font-medium">
            <li className="pt-8">
              <Link href="/admin" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <ProfileIcon size={25} />
                </div>
                <span className="ml-3 mt-[5px] text-2xl sm:text-base">Users</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/courses" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <DashboardIcon size={25} />
                </div>
                <span className="ml-3 mt-[5px] text-2xl sm:text-base">Courses</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/videos" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <VideoIcon size={25} />
                </div>
                <span className="ml-3 mt-[5px] text-2xl sm:text-base">Videos</span>
              </Link>
            </li>

            {/* New Button to Toggle EnrollmentByPhone */}
            <li>
              <button onClick={toggleEnrollmentForm} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <FaqIcon size={25} />
                </div>
                <span className="ml-3 mt-[5px] text-2xl sm:text-base">Student Enrollment</span>
              </button>
            </li>

            <li>
              <Link href="/admin/login" onClick={handleSignOut} className="sm:hidden flex absolute bottom-10 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <LogoutIcon size={23} />
                </div>
                <span className="flex-1 ml-3 text-2xl sm:text-base whitespace-nowrap">Sign Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Conditionally render the EnrollmentByPhone component */}
      {showEnrollment && (
        //<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <EnrollmentByPhone closePopup={closePopup} />
          </div>
        //</div>
      )}
    </>
  );
}
