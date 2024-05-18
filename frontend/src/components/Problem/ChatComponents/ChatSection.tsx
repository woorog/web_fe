import { ReactNode } from 'react';

export default function ChatSection({ children }: { children: ReactNode }) {
  return <div className="w-full h-full border rounded-lg drop-shadow-lg bg-primary bg-white">{children}</div>;
}
