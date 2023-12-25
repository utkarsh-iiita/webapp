"use client"
import React, { use, useState } from 'react'
import { signIn } from 'next-auth/react';
import { resolveObjectURL } from 'buffer';

const page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    console.log(username, password)
    const result =  await signIn('LDAP', {
      username,
      password,
      redirect: true,
      callbackUrl: '/'
    });
    console.log(result);
  }
  return (
    <>
      <h1>Sign In</h1>
      <form>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={onSubmit}>Sign In</button>
      </form>
    </>
  )
}

export default page