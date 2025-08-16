
import { UserButton } from "@clerk/nextjs";

interface ClientUserButtonProps {
  afterSignOutUrl?: string;
  className?: string;
}

export default function ClientUserButton({ 
  afterSignOutUrl = "/",
  className 
}: ClientUserButtonProps = {}) {
  return (
    <UserButton 
      afterSignOutUrl={afterSignOutUrl}
      appearance={{
        elements: {
          userButtonAvatarBox: `w-12 h-12 ${className || ''}`.trim(),
        }
      }}
    />
  );
}