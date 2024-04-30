"use client"


import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"


export default function Home(){
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1  className="text-3xl md:text-5xl font-bold">
        Enter the realm of clandestine discourse.
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg"> 
        Honest responses where your identity stays undisclosed.
         </p>
      </section>

      <Carousel 
      plugins={[Autoplay({delay : 2000})]}
      className="w-full max-w-xs">
      <CarouselContent>
      {messages.map( (item,index)=>(
        <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardHeader>
              {item.title}
            </CardHeader>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-lg font-semibold">{item.content}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
      ) )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Authentic Feedback. All rights reserved.
      </footer>
    </>
  )
}