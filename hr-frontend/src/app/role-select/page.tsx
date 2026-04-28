import Link from "next/link";
import { RoleSelection } from "@/components/auth/role-selection";

export default function RoleSelectPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background p-6 md:p-10">
      <RoleSelection />
      <div className="mx-auto mt-6 max-w-5xl">
        <Link href="/signup" className="text-xs font-medium text-primary hover:underline">
          Skip and continue to signup
        </Link>
      </div>
    </main>
  );
}
