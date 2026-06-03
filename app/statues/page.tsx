"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const images: Record<string, string[]> = {
  dao: [
    "/dao/yuqing-yuanshi-tianzun.jpg",
    "/dao/taiqing-daode-tianzun.jpg",
    "/dao/shangqing-lingbao-tianzun.jpg",
  ],
  fo: [
    "/fo/amituofo.jpg",
    "/fo/shijiamouni.jpg",
    "/fo/guanshiyin-psa.jpg",
  ],
};

const displayNames: Record<string, string> = {
  "/dao/yuqing-yuanshi-tianzun.jpg": "玉清元始天尊",
  "/dao/taiqing-daode-tianzun.jpg": "太清道德天尊",
  "/dao/shangqing-lingbao-tianzun.jpg": "上清靈寶天尊",
  "/fo/amituofo.jpg": "阿弥陀佛",
  "/fo/shijiamouni.jpg": "释迦牟尼",
  "/fo/guanshiyin-psa.jpg": "观世音菩萨",
};

function StatueGallery({ type }: { type: string }) {
  const imageList = images[type];
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const fileName = displayNames[imageList[currentIndex]] ?? "";

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">{fileName}</h2>
        <img
          src={imageList[0]}
          alt={displayNames[imageList[0]] ?? ""}
          width={250}
          height={510}
          className="rounded-lg object-cover shadow-lg"
          style={{ width: 250, height: 510 }}
        />
        <span className="text-sm text-zinc-400">
          1 / {imageList.length}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">{fileName}</h2>
      <Carousel setApi={setApi} className="w-[250px]">
        <CarouselContent>
          {imageList.map((src) => (
            <CarouselItem key={src}>
              <img
                src={src}
                alt={displayNames[src] ?? ""}
                width={250}
                height={510}
                className="rounded-lg object-cover shadow-lg"
                style={{ width: 250, height: 510 }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <span className="text-sm text-zinc-400">
        {currentIndex + 1} / {imageList.length}
      </span>
    </div>
  );
}

export default function StatuesPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <Tabs defaultValue="dao" className="w-full max-w-md flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="dao" className="flex-1">道</TabsTrigger>
            <TabsTrigger value="fo" className="flex-1">佛</TabsTrigger>
          </TabsList>
          <TabsContent value="dao">
            <StatueGallery type="dao" />
          </TabsContent>
          <TabsContent value="fo">
            <StatueGallery type="fo" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
