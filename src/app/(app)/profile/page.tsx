import Link from "next/link";
import { getServerSession } from "next-auth";
import { Users } from "lucide-react";
import { authOptions } from "@/lib/auth";
import MemberProfile from "@/components/MemberProfile";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const username = (session?.user as any)?.username as string;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/members" className="btn-ghost">
          <Users className="w-3.5 h-3.5" />
          Ver membros do clube
        </Link>
      </div>
      <MemberProfile username={username} />
    </div>
  );
}
