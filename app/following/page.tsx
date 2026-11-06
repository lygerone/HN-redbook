import { BottomNav, TopBar } from "@/components/Chrome";
import { FollowingFeed } from "@/components/Follow";
import { getAllDays } from "@/lib/data";

export const metadata = { title: "关注 · HN 红书" };

export default function FollowingPage() {
  const days = getAllDays();
  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-3 pb-28">
        <FollowingFeed days={days} />
        <BottomNav />
      </main>
    </>
  );
}
