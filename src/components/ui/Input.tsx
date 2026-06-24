import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input 
      className={`w-full h-10 px-3 text-body bg-white border border-border rounded-lg transition-colors duration-150 placeholder:text-text-tertiary focus:border-primary focus:outline-none disabled:bg-muted disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea 
      className={`w-full px-3 py-3 text-body bg-white border border-border rounded-lg transition-colors duration-150 placeholder:text-text-tertiary focus:border-primary focus:outline-none resize-none ${className}`}
      {...props}
    />
  );
}
