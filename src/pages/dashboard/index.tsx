import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import MemberDashboard from "@/components/MemberDashboard";
import { requireMember, type SsrAuthProps } from "@/lib/auth/ssrAuth";
import { useAppDispatch } from "@/store";
import { logout as logoutThunk } from "@/store/apps/auth";

export const getServerSideProps = requireMember;

export default function DashboardPage({ session }: SsrAuthProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleLogout() {
    void dispatch(logoutThunk()).finally(() => {
      void router.push("/");
    });
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Member Dashboard — The Movie Studio</title>
        <meta
          name="description"
          content="Your Movie Studio membership dashboard — benefits, events, merch, and more."
        />
      </Head>
      <MemberDashboard session={session} onLogout={handleLogout} />
      <div className="sr-only">
        <Link href="/membership">Manage plan</Link>
      </div>
    </>
  );
}
