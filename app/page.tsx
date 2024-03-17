"use client";

import Image from "next/image";
import Navbar from "./Component/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from "./Component/Container";
import { convertKelvinToCelcius } from "./utils/convertKelvinToCelcius";
import { RxDoubleArrowUp } from "react-icons/rx";
import { RxDoubleArrowDown } from "react-icons/rx";
import WeahterIcon from "./Component/WeahterIcon";

//Api
//https://api.openweathermap.org/data/2.5/forecast?q=akure&appid=cc6d71e6cc19bbed0694bcae70b59d86

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=akure&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
  });

  const firstData = data?.list[0];

  console.log("data", data?.city);

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/*Today data*/}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-center">
              <p className="text-2xl">
                {" "}
                {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}{" "}
              </p>
              <p className="text-lg">
                {" "}
                {format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}{" "}
              </p>
            </h2>
            <Container className="flex gap-10 px-6 items-center">
              {/*Temperature*/}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelcius(firstData?.main.temp ?? 296.37)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToCelcius(firstData?.main.temp ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2 flex items-center">
                  <span className="flex items-center">
                    {convertKelvinToCelcius(firstData?.main.temp_min ?? 0)}°
                    <RxDoubleArrowDown />
                  </span>
                  <span className="flex items-center">
                    {convertKelvinToCelcius(firstData?.main.temp_max ?? 0)}°
                    <RxDoubleArrowUp />
                  </span>
                </p>
              </div>

              {/*Time and weather icon*/}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>
                    <WeahterIcon iconName={d.weather[0].icon}/>
                    <p>{convertKelvinToCelcius(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/*7 day forecast data*/}
        <section></section>
      </main>
    </div>
  );
}
