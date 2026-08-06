import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MemberProfile from "@/components/MemberProfile";

export const dynamic = "force-dynamic";

export default function MemberPage({ params }: { params: { username: string } }) {
  return (
    <div>
      <Link href="/members" className="btn-ghost mb-4">
        <ArrowLeft className="w-3.5 h-3.5" />
        Todos os membros
      </Link>
      <MemberProfile username={params.username} />
    </div>
  );
}
