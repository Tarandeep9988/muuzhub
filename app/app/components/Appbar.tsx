"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

type Props = {}

const Appbar = (props: Props) => {
  const session = useSession();
  console.log(session);

  return (
    <div>
      <div className='flex justify-between'>
        <div> 
          MuuzHub
        </div>
        <div>
          {session.data 
            ? 
            <button className='bg-blue-400 m-2 p-2 cursor-pointer' onClick={() => signOut()}>Signout</button>
            :
            <button className='bg-blue-400 m-2 p-2 cursor-pointer' onClick={() => signIn()}>Signin</button>
          }
        </div>
      </div>
    </div>
  )
}

export default Appbar