'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:8080/api/users/login/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
      credentials: 'include', // 쿠키 저장!
    });

    if (res.ok) {
      window.location.href = '/extension-blocker';
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-lg font-bold mb-4">🔐 로그인</h1>
      <input
        placeholder="User ID"
        className="border px-2 py-1 mb-2 w-full"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        className="border px-2 py-1 mb-4 w-full"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded w-full"
        onClick={handleLogin}
      >
        로그인
      </button>
    </div>
  );
}
