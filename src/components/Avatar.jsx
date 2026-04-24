import { useState } from 'react';

export default function Avatar({ role, size = 'md' }) {
  const isAdmin = role === 'admin';

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const bgClass = isAdmin
    ? 'bg-violet-100 border-violet-300'
    : 'bg-indigo-100 border-indigo-300';

  const emoji = isAdmin ? '👑' : '📖';

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} ${bgClass} rounded-full border flex items-center justify-center select-none`}
      title={isAdmin ? 'Admin' : 'User'}
    >
      <span>{emoji}</span>
    </div>
  );
}