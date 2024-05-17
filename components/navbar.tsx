"use client";

import { Button } from "@/components/ui/button";
import { Flower2, Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import dynamic from "next/dynamic";

const Navbar = () => {
  const menus = [
    { title: "Home", path: "/" },
    { title: "Monitor", path: "/monitor" },
    { title: "History", path: "/history" },
    { title: "Automation", path: "/automation" },
    { title: "About", path: "/about" },
  ];

  return (
    <header className="p-2 shadow text-gray-800 w-full h-max">
      <div className="flex justify-between">
        <div className="flex justify-between w-full">
          <Link
            href="/"
            aria-label="Back to homepage"
            className=" flex md:justify-center justify-start items-center"
          >
            <Flower2 />
          </Link>

          <div
            className={`justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 hidden md:mr-10`}
          >
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 mt-2 ml-5">
              {menus.map((item, idx) => (
                <li
                  key={idx}
                  className="text-gray-600 hover:text-rose-600 text-base font-semibold"
                >
                  <Link href={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <button
                className="p-2 lg:hidden flex md:justify-center justify-start"
                title="menu"
                type="button"
              >
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div
                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0`}
              >
                <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 mt-2">
                  {menus.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-gray-600 hover:text-rose-600 text-base"
                    >
                      <Link href={item.path}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
