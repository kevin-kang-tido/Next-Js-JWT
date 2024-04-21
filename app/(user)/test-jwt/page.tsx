'use client'
import { NextResponse } from 'next/server';
import React, { useState } from 'react'
import { date } from 'yup';

export default function TestJWT() {

    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [unAuthorized, setUnAuthorized] = useState(false);


    // handle login
    const handleLogin = async () => {

        const email = "mrkevindev033@gmail.com";
        const password = "mrkevin1234!@#$";

        fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
            method: "POST",
            headers: {
                 "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password})
        })
        .then(res => res.json())
        .then(data => {
            console.log("Data in jwt test", data);
            setAccessToken(data.accessToken)  
            setUser(data.user)
        })
        .catch(err => console.log(err))

    }
    // handle update 
    const handlePartailUpate = async () => {
        const body = {
            name:"casual wardrobe update1",
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${533}`, {
            method: "PATCH",
            headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body),
        })
        // console.log(res)
        if(res.status == 401){
            setUnAuthorized(true)
        }

        const data = await res.json();
        console.log("Data from partial update: ",data);

    };

    // handle refreshtoken 
    const handleRefreshToken = async () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh", {
            method: "POST",
            // everything thats store in cookies will send directly  to server 
            credentials:"include",
            body: JSON.stringify({}),

        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Data form refresh token : ",data)
            setAccessToken(data.accessToken);
        })
        .catch((error) => {
            console.log(error);
        });
    };


  return (
    <main className='h-screen grid place-content-center'>
        <h1 className='text-5xl'>Testing Handle with JWT</h1>
        <button onClick={handleLogin} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
            Login
        </button>
        <button onClick={handlePartailUpate} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
            Partial Update
        </button>
        {unAuthorized && (
                <button onClick={handleRefreshToken} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
                    Refresh Token
               </button>
        )}

    </main>
  )
}