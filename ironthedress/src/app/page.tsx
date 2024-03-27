"use client"
import ImageDisplay from "@/assets/output.png";
import Image from 'next/image';
import Header from "@/components/header";
import { WavyBackground } from "@/components/ui/wavy-background";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import Link from "next/link";
import Footer from "@/components/footer";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()



  return (
    <main className="flex flex-col min-h-screen ">
      <Header />
      <div className="">
        {/* wavy background */}
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
      {/* 3d card */}
      <div>
        <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Sample
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            This is how our model will work to Iron you dress
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={ImageDisplay}
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              as={Link}
              href="/iron-space"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              href="/iron-space"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              onClick={() => router.push('/iron-space')}
            >
              Sign up
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
      <Footer/>
      </div>
    </main>
  );
}
