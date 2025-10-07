import React from 'react'
import { useAuth } from '../Context/auth'

export default function Login() {
  const [auth, setAuth] = useAuth();

  return (
    
    <div>Login</div>
  )
}
