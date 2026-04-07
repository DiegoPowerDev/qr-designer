"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'



export default function Page() {

    const router = useRouter()

    useEffect(()=>{
        router.push("https://drive.google.com/file/d/1Nnf0nJMKws5N0uC4Rd57VgY41cB5cnl2/view?usp=sharing")
    },[])

  return (
    <div>Page</div>
  )
}
