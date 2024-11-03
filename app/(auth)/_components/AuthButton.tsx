"use client,_c"

import React from 'react'
import { useFormStatus } from 'react-dom'


export default function AuthButton() {
    const {pending} = useFormStatus()
  return (
    <button disabled={pending} type='submit'>
        {pending ? "loading..." : "sign in"}ALOOOO
    </button>
  )
}
