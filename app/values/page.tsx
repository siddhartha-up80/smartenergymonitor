"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const Values = () => {
  const [voltagedata, setVoltageData] = useState<any>("");
  const [voltage, setVoltage] = useState<any>("");
  const [powerData, setPowerData] = useState<any>("");
  const [power, setPower] = useState<any>("");

  const fetchVoltageData = async () => {
    try {
      const res = await fetch(`/api/voltage`);
      const json = await res.json();
      setVoltageData(json);
    } catch (error) {
      console.error("Error fetching voltage data:", error);
    }
  };
  const fetchPowerData = async () => {
    try {
      const res = await fetch(`/api/power`);
      const json = await res.json();
      setPowerData(json);
    } catch (error) {
      console.error("Error fetching power data:", error);
    }
  };

  const handlePowerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPower(event.target.value);
  };

  const setPowerNew = async () => {
    const response = await fetch("/api/power", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        power: power,
      }),
    });

    if (response.ok) {
      console.log("Power data saved successfully");
    }
  };
  const setVoltageNew = async () => {
    const response = await fetch("/api/voltage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voltage: voltage,
      }),
    });

    if (response.ok) {
      console.log("Voltage data saved successfully");
    }
  };

  const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(event.target.value);
  };

  //   useEffect(() => {
  //     // fetchPowerData();
  //     // fetchVoltageData();
  //   }, [powerData, voltagedata]);

  return (
    <div className="max-w-6xl mx-auto mt-10 justify-center items-center h-screen flex w-[90vw]">
      <div className="flex flex-col gap-2">
        <div>
          <label
            htmlFor="power"
            className="block text-sm font-medium text-gray-700"
          >
            Power
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="power"
              id="power"
              value={power}
              onChange={handlePowerChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <Button onClick={setPowerNew}>Submit Power</Button>
          </div>
        </div>{" "}
        <div>
          <label
            htmlFor="voltage"
            className="block text-sm font-medium text-gray-700"
          >
            Voltage
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="voltage"
              id="voltage"
              value={voltage}
              onChange={handleVoltageChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <Button onClick={setVoltageNew}>Submit Power</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
