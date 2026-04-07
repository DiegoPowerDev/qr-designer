"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'



export default function Page() {

    const router = useRouter()

    useEffect(()=>{
        router.push("https://drive.google.com/file/d/1N06wOgxDM7bKFS736OWK5dSx8liDGq_Z/view?usp=sharing")
    },[])

  return (
    <div>Page</div>
  )
}
