import Image from "next/image";
import { useState } from "react";

interface StudentAvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

export default function StudentAvatar({ name, src, className = "size-8" }: StudentAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();
  
  const avatarSrc = src?.startsWith('http') 
    ? src 
    : src 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${src}` 
      : null;

  return (
    <div className={`shrink-0 rounded-xl bg-navy text-yellow flex items-center justify-center text-[11px] font-black border border-white/10 shadow-inner relative overflow-hidden ${className}`}>
      {avatarSrc && !imgError ? (
        <Image
          src={avatarSrc}
          alt={name}
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : initial}
    </div>
  );
}
