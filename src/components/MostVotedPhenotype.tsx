import { useMostVotedPhenotype } from "@/hooks/use-most-voted-phenotype";

interface MostVotedPhenotypeProps {
  profileSlug: string;
}

export const MostVotedPhenotype = ({ profileSlug }: MostVotedPhenotypeProps) => {
  const { mostVotedPhenotype, loading } = useMostVotedPhenotype(profileSlug);

  if (loading || !mostVotedPhenotype) {
    return null;
  }

  return (
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs bg-background/80 px-1 py-0.5 rounded">
      {mostVotedPhenotype}
    </div>
  );
};