import { cn } from "@/lib/utils";

interface LoadingBarProps {
  loading: boolean;
}

export function LoadingBar({ loading }: LoadingBarProps) {
  if (!loading) return null;

  return (
    <div className="h-1 w-full bg-muted overflow-hidden">
      <div 
        className={cn(
          "h-full bg-primary animate-pulse",
          "w-1/3 animate-[slide_1s_ease-in-out_infinite]"
        )}
        style={{
          animation: "slide 1s ease-in-out infinite"
        }}
      />
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
