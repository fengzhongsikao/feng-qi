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

const IMAGE_CLASS =
  "w-[250px] max-h-[min(520px,70vh)] h-auto rounded-lg object-contain shadow-lg";

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
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const fileName = displayNames[imageList[currentIndex]] ?? "";

  return (
    <div className="flex flex-col items-center gap-4 px-12">
      <h2 className="text-xl font-semibold">{fileName}</h2>
      <Carousel setApi={setApi} opts={{ duration: 15 }} className="w-[250px]">
        <CarouselContent className="-ml-0">
          {imageList.map((src) => (
            <CarouselItem key={src} className="pl-0">
              <img
                src={src}
                alt={displayNames[src] ?? ""}
                width={250}
                className={IMAGE_CLASS}
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
  const [activeTab, setActiveTab] = useState("dao");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md flex-col"
        >
          <TabsList className="w-full">
            <TabsTrigger value="dao" className="flex-1">道</TabsTrigger>
            <TabsTrigger value="fo" className="flex-1">佛</TabsTrigger>
          </TabsList>
          <TabsContent value="dao" className="mt-4 flex justify-center">
            {activeTab === "dao" && <StatueGallery key="dao" type="dao" />}
          </TabsContent>
          <TabsContent value="fo" className="mt-4 flex justify-center">
            {activeTab === "fo" && <StatueGallery key="fo" type="fo" />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
