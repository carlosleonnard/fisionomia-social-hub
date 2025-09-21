import { Vote } from "lucide-react";
import { useUniqueVoters } from "@/hooks/use-unique-voters";

interface UniqueVoteCounterProps {
  profileSlug: string;
  className?: string;
}

export const UniqueVoteCounter = ({ profileSlug, className = "" }: UniqueVoteCounterProps) => {
  const { data: uniqueVotersCount, isLoading } = useUniqueVoters(profileSlug);

  // Não mostrar nada durante o carregamento ou quando não há votos
  if (isLoading || !uniqueVotersCount || uniqueVotersCount === 0) {
    return null;
  }

  return (
    <div 
      className={`absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 ${className}`}
      title={`${uniqueVotersCount} usuário(s) único(s) votaram neste perfil`}
    >
      <Vote className="h-2.5 w-2.5" />
      <span className="text-xs">{uniqueVotersCount}</span>
    </div>
  );
};