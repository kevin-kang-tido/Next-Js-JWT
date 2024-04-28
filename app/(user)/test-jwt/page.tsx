'use client'
import { useCreateProductMutation, useUpdateProductMutation ,useDeleteProductMutation} from '@/redux/service/ecommerce';
import { NextResponse } from 'next/server';
import React, { useState } from 'react'
import { date } from 'yup';

export default function TestJWT() {

    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [unAuthorized, setUnAuthorized] = useState(false);
    // Create Product with generated hook
    const [createProduct, { dataCreateProduct, isLoadingCreateProduct, errorCreateProduct }] = useCreateProductMutation();
    // handle update product
    const [updateProduct,{data,error,isLoading}] = useUpdateProductMutation();
    // hanle Delete products
    const [deleteProduct,{dataDelete, errorDelete, isLoadingDelete}] = useDeleteProductMutation();

    // create 
    console.log("Here is the data create: ",dataCreateProduct);

    // update
    console.log("Here is Data update with RTK: ",data);
    console.log("Here is Error update : ",error);
    // log dele 
    console.log("Here is Data Delete : ",dataDelete)

    // hanle create produc with RTK 
    const handleCreateProductWithRTK = () => {
        createProduct({
            newProduct:{
                category:{
                    name:"Khmer Products"
                },
                name:"A new Laptop 15 Pro",
                desc:"this is testng create product with RTK by bros ztart...:)",
                price:124,
                quantity:12
            },
            accessToken:accessToken
        })

    }
    // handle update products by id with RTK query 
    const handleUpdateWithRTK = async () => {
        updateProduct({
            id:759,
            updatedProduct:{
                // update product more here 
                name: "update products one!"
            },
            accessToken:accessToken
        });

    }
    // delete products
    const handleDeleteWithRTK = async () => {
        deleteProduct({
            id:761,
            accessToken:accessToken
        })
    }
     
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
    // handle logout 
    const handleLogout = async () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/logout", {
            method: "POST",
            // everything thats store in cookies will send directly  to server 
            credentials:"include",
            body: JSON.stringify({}),

        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Data form logout token : ",data)
            setAccessToken(data.accessToken);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // hava loading
    if(isLoading){
        return(
            <main className='h-screen grid place-content-center'>
            <h1
             className='font-bold text-5xl '
             >Loading
            </h1>
            </main>
        )
    }

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
        <button onClick={handleLogout} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
           logout
        </button>
        <button onClick={handleCreateProductWithRTK} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
           Create Product 
        </button>
        <button onClick={handleUpdateWithRTK} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
           Handle Update RTK
        </button>
        <button onClick={handleDeleteWithRTK} className='my-3 p-4 bg-blue-600 rounded-xl text-[#e2e8f0] text-2xl font-semibold'>
           Delete Product
        </button>
    </main>
  )
}