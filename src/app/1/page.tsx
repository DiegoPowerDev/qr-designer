"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'



export default function Page() {

    const router = useRouter()

    useEffect(()=>{
        router.push("https://drive.google.com/file/d/1t0U1sERx9B8flej2ck91-LIyEuOe6tug/view?usp=drive_link")
    },[])

  return (
    <div>Page</div>
  )
}
