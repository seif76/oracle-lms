import React from "react"

export default function StudentProfile({
    name , email , phoneNumber , parentContact
}) {

return(
<div className="sm:m-4" >
<div className="px-4 sm:px-0">
  <h2 className="text-lg font-semibold leading-7 text-gray-900">Student Information</h2>
  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and information.</p>
</div>
<div className="mt-6 border-t border-gray-100">
  <dl className="divide-y divide-gray-100">
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">Full name:</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{name}</dd>
    </div>
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">Email address:</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{email}</dd>
    </div>
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">parent Contact:</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{parentContact}</dd>
    </div>
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">Phone Number:</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{phoneNumber}</dd>
    </div>
  
  </dl>
</div>
</div>
)
}