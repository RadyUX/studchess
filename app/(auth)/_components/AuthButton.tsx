"use client,_c"

import { Button } from '@/components/ui/button'
import React from 'react'
import { useFormStatus } from 'react-dom'


export default function AuthButton() {
    const {pending} = useFormStatus()
  return (
    <Button variant="white" disabled={pending} type='submit'>
        {pending ? "loading..." : "sign in"}
    </Button>
  )
}
