import { Vote } from "lucide-react";
import { useUniqueVoters } from "@/hooks/use-unique-voters";

interface UniqueVoteCounterProps {
  profileSlug: string;
  className?: string;
}

export const UniqueVoteCounter = ({ profileSlug, className = "" }: UniqueVoteCounterProps) => {
  const { data: uniqueVotersCount, isLoading } = useUniqueVoters(profileSlug);

  if (isLoading) {
    return (
      <div className={`absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 ${className}`}>
        <Vote className="h-2.5 w-2.5" />
        <span className="text-xs">...</span>
      </div>
    );
  }

  return (
    <div 
      className={`absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 ${className}`}
      title={`${uniqueVotersCount || 0} usuário(s) único(s) votaram neste perfil`}
    >
      <Vote className="h-2.5 w-2.5" />
      <span className="text-xs">{uniqueVotersCount || 0}</span>
    </div>
  );
};