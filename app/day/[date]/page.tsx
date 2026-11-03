import { notFound } from "next/navigation";
import { TopBar, Footer } from "@/components/Chrome";
import Feed from "@/components/Feed";
import { getAllDays, getDay } from "@/lib/data";

export function generateStaticParams() {
  return getAllDays().map((d) => ({ date: d.date }));
}

export default async function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = getDay(date);
  if (!day) notFound();
  return (
    <>
      <TopBar />
      <Feed day={day} days={getAllDays()} />
      <Footer />
    </>
  );
}
