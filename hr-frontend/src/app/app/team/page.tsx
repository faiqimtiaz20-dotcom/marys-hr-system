import { TeamPage } from "@/components/team/team-page";

export default async function TeamRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <TeamPage simulateLoadError={sp.error === "1"} />;
}
