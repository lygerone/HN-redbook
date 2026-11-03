import { TopBar, Footer } from "@/components/Chrome";
import Feed from "@/components/Feed";
import { getAllDays, getLatestDay } from "@/lib/data";

export default function Home() {
  const days = getAllDays();
  const latest = getLatestDay();
  if (!latest) return <main className="p-10 text-center text-neutral-500">暂无数据</main>;
  return (
    <>
      <TopBar />
      <Feed day={latest} days={days} />
      <Footer />
    </>
  );
}
