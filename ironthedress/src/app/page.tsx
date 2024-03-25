import Header from "@/components/header";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen ">
      <Header />
      <div className="">
      <WavyBackground className="max-w-4xl mx-auto pb-40 ">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Iron your dress
          </p>
          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Leverage the power of AI to Iron the dress
          </p>
        </div>
      </WavyBackground>
      </div>
    </main>
  );
}
