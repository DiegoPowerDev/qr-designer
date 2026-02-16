import QrGenerator from "@/components/qrgenerator";

export default function Home() {
  return (
    <main className="flex-1 flex w-full flex-col items-center   bg-black text-yellow-500">
      <QrGenerator />
    </main>
  );
}
