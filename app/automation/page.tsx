//@ts-nocheck
"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Clock, Cloud, Gauge, Lightbulb, Mic } from "lucide-react";
import React, { useEffect, useState } from "react";

const DigitalClock = ({ className }: { className?: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour12: false });
  };

  return <div className={`text-4xl ${className}`}>{formatTime(time)}</div>;
};

const Page = () => {
  const [energyData, setEnergyData] = useState<any>([]);
  const [voltagedata, setVoltageData] = useState<any>("");
  const [powerData, setPowerData] = useState<any>("");
  const [suggestions, setSuggestions] = useState<any>([]);
  const [userCommand, setUserCommand] = useState<any>([]);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false); // State to check if speech recognition is supported
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false); // State to track if speech recognition is active

  const [ailoading, setAiLoading] = useState<any>(false);
  const [ontime, setonTime] = useState<any>("");
  const [offtime, setoffTime] = useState<any>("");
  const [cuurentState, setcuurentState] = useState<any>(true);

  const [energy, setenergy] = useState<any>(240);
  const [maxenergy, setmaxenergy] = useState<any>(0);

  const turnByEnergy = () => {
    if (energy > maxenergy) {
      setcuurentState(false);
    }
  };

  const voltagefluctuation = () => {};

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

  useEffect(() => {
    // //  fetchData();
    // fetchPowerData()
    // fetchVoltageData()
    turnByEnergy();
    const initialIntervalId = setInterval(fetchData, 5000);

    return () => clearInterval(initialIntervalId);
  }, [energy, maxenergy]);

  useEffect(() => {
    // Check if SpeechRecognition API is supported
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      setSpeechRecognitionSupported(true);
      console.log("SpeechRecognition API is supported");
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }
  }, []);

  const startSpeechRecognition = () => {
    if (speechRecognitionSupported) {
      // Initialize speech recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Start listening for speech
      recognition.start();

      // Event listener for speech recognition result
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(transcript);
        setUserCommand(transcript);
        setSpeechRecognitionActive(false);
        generateAiResponseVoice(transcript);
      };

      // Event listener for speech recognition error
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setSpeechRecognitionActive(false);
      };

      // Set speech recognition active state to true
      setSpeechRecognitionActive(true);
    }
  };

  const turnstate = async () => {
    try {
      const response = await fetch("api/relaySet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: cuurentState ? "0" : "1" }),
      });
    } catch (error) {
      console.error("Error toggling relay state:", error);
    }
  };

  const turnTimeBased = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const onTimeArray = ontime.split(":");
    const offTimeArray = offtime.split(":");
    const onHour = parseInt(onTimeArray[0]);
    const onMinute = parseInt(onTimeArray[1]);
    const offHour = parseInt(offTimeArray[0]);
    const offMinute = parseInt(offTimeArray[1]);

    // Check if the current time is equal to the on time
    if (currentHour === onHour && currentMinute === onMinute) {
      // Set state to ON
      setcuurentState(true);
    }
    // Check if the current time is equal to the off time
    else if (currentHour === offHour && currentMinute === offMinute) {
      // Set state to OFF
      setcuurentState(false);
    }
  };

  useEffect(() => {
    // Call turnTimeBased initially to set the initial state
    turnTimeBased();

    // Set up interval to call turnTimeBased periodically
    const intervalId = setInterval(turnTimeBased, 1000); // Call every minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [ontime, offtime]);

  useEffect(() => {
    turnstate();
    console.log("State changed to ", cuurentState);
  }, [cuurentState]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/energydata`);
      const json = await res.json();
      setEnergyData(json);
    } catch (error) {
      console.error("Error fetching energy data:", error);
    }
  };

  // console.log(parseInt(powerData.power) / parseInt(voltagedata.voltage));

  useEffect(() => {
    // Fetch data initially
    fetchData();
    fetchPowerData();
    fetchVoltageData();

    // Setup interval to fetch data every 5 seconds
    const initialIntervalId = setInterval(fetchData, 5000);

    // Clean up the initial interval on component unmount
    return () => clearInterval(initialIntervalId);
  }, []);

  const generateAiResponseVoice = async (transcript: any) => {
    setSuggestions([]);
    setAiLoading(true);

    const inputData = [
      `Voltage:  ${voltagedata?.voltage}V, Current: ${parseFloat(
        (parseInt(powerData?.power) / parseInt(voltagedata?.voltage)).toFixed(2)
      )}A, Power: ${powerData?.power}W, Energy: ${energy}Wh`,
    ];

    try {
      const openaiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/gpt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `You are embedded in a esp32 energy monitor website, you have to understand what user want to say, user may say in different languages like hindi, english, tamil or telugu, identify the keywords like on, off, of, onn, offf, and the other words which sounds similar like on/off in that user response, based on that you have to only send a parsable JSON format response like this - {
  "state": "0"
}, do not send anything else other than parsable JSON in the response, it should definitely send 0 or 1 based on the user command in parsable JSON format only, this is the user command to understand: ${transcript}, here is the energy pattern for your reference: ${inputData}`,
          }),
        }
      );

      if (openaiResponse.ok) {
        const suggestionsData = await openaiResponse.json();

        // setSuggestions(suggestionsData); // Update state with OpenAI suggestions

        // console.log(suggestionsData.state);
        const parseData = JSON.parse(suggestionsData || "");

        console.log(parseData.state);

        // setSuggestions(parseData);
        // Extract state from ChatGPT response and convert it to boolean
        const newState = parseInt(parseData.state) === 1;
        setcuurentState(newState); // Update energy state based on ChatGPT response
        console.log(parseData.state);
        setAiLoading(false);
      } else {
        console.error("Failed to fetch suggestions from OpenAI");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };

  const generateAiSuggestions = async () => {
    setSuggestions([]);
    fetchData();
    setAiLoading(true);

    try {
      // Extract the last 5 energy data entries
      // const lastFiveEntries = energyData.slice(-10);

      // Prepare data for OpenAI API (adjust based on OpenAI API requirements)
      // const inputData = lastFiveEntries.map((entry) => entry.power).join("\n");
      // const inputData = lastFiveEntries
      //   .map((entry: any) => {
      //     return `Voltage: ${entry.voltage}V, Current: ${entry.current}A, Power: ${entry.power}W, Energy: ${entry.energy}kWh`;
      //   })
      //   .join("\n");

      const inputData = [
        `Voltage:  ${energyData?.voltage}V, Current: ${parseFloat(
          (parseInt(powerData?.power) / parseInt(voltagedata?.voltage)).toFixed(
            2
          )
        )}A, Energy: Calculate expected energy units consumed if it runs for 1 day`,
      ];

      const openaiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/gpt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `understand this information: ${inputData}, now understand this information and its pattern, based on that you have to only send a parsable JSON format response like this - {
  "response": "suggestions and details for the data in text format with energy calculation and formulas",
  "energy": "calculated energy in wh"
}, do not send any text, i repeat do not send any text response, just send parsable json format`,
          }),
        }
      );

      if (openaiResponse.ok) {
        const suggestionsData = await openaiResponse.json();

        // setSuggestions(suggestionsData); // Update state with OpenAI suggestions

        // console.log(suggestionsData.state);
        const parseData = JSON.parse(suggestionsData || "");

        console.log(parseData.response);
        console.log(parseData);
        setSuggestions(parseData);

        const energyString = parseData.energy.match(/(\d+)wh/i)?.[1];
        setenergy(parseInt(energyString || "0", 10));
        // Extract state from ChatGPT response and convert it to boolean
        // const newState = parseInt(parseData.state) === 1;
        // setcuurentState(newState); // Update energy state based on ChatGPT response
        // console.log(parseData.state);

        setAiLoading(false);
      } else {
        console.error("Failed to fetch suggestions from OpenAI");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto mt-10">
        <section className="body-font">
          <div className="container px-5 py-24 mx-auto space-y-6">
            <div className="flex flex-col text-center w-full mb-10">
              <h1 className="sm:text-3xl text-2xl font-medium title-font ">
                OpenAI GPT4 Based Smart Energy Monitoring System
              </h1>
              <div className="w-max mx-auto mt-8">
                <Card className="md:min-w-[30vw] min-w-[70vw] ">
                  <CardHeader className="flex justify-center items-center w-full">
                    <CardTitle className="text-center flex justify-center items-center w-full text-5xl">
                      {cuurentState === false ? "OFF" : "ON"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full flex-1 h-full justify-center items-center flex">
                    <Button
                      className="w-full"
                      onClick={() => setcuurentState(!cuurentState)}
                    >
                      {cuurentState === false ? "Turn On" : "Turn Off"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="flex rounded-lg h-full shadow-md flex-col items-center md:flex-row justify-between p-4 pb-0">
              <CardHeader className="flex justify-start items-center w-max">
                <div className="flex items-center mb-3">
                  <CardTitle className="flex gap-2 text-center">
                    <h2 className="">Energy Usage</h2>
                  </CardTitle>
                </div>
                <div>
                  <Button onClick={fetchData}>Get Values</Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col md:flex-row gap-3 w-full">
                <Card className="flex justify-center items-center w-full">
                  <p className="leading-relaxed text-4xl font-bold text-center">
                    {voltagedata?.voltage} Volts
                  </p>
                </Card>
                <Card className="flex justify-center items-center w-full">
                  <p className="leading-relaxed text-4xl text-center font-bold">
                    {parseFloat(
                      (
                        parseInt(powerData?.power) /
                        parseInt(voltagedata?.voltage)
                      ).toFixed(2)
                    )}
                    A
                  </p>
                </Card>
                <Card className="flex justify-center items-center w-full">
                  <p className="leading-relaxed text-4xl text-center font-bold">
                    {powerData?.power} Watts
                  </p>
                </Card>
                {/* <Card className="flex justify-center items-center w-full">
                  <p className="leading-relaxed text-4xl text-center font-bold">
                    {energyData?.energy} KWh
                  </p>
                </Card> */}
              </CardContent>
              {/* <CardFooter>
               
              </CardFooter> */}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 -m-4">
              <div className="p-4">
                <Card className="flex rounded-lg h-full shadow-md p-8 flex-col justify-between">
                  <CardHeader className="flex justify-center w-full items-center">
                    <div className="flex items-center mb-3">
                      <CardTitle className="flex gap-2">
                        <Mic />
                        <h2 className="">Control With Voice</h2>
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex-grow">
                      <p className="leading-relaxed text-base text-center">
                        Our AI based automation system allows you to issue
                        natural language voice commands to turn appliances on or
                        off.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {speechRecognitionSupported && !speechRecognitionActive ? (
                      <Button
                        onClick={startSpeechRecognition}
                        className="gap-2 mx-auto w-full"
                      >
                        <Mic /> Start Voice Control
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="gap-2 mx-auto w-full cursor-not-allowed"
                      >
                        Listening...
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
              <div className="p-4">
                <Card className="flex rounded-lg h-full shadow-md p-8 flex-col">
                  <CardHeader className="flex justify-center w-full items-center">
                    <div className="flex-grow flex items-center">
                      <CardTitle className="gap-2 flex">
                        <Clock /> Time Based
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-4 flex-col">
                      <div>
                        <DigitalClock className="" />
                        <span>Current Time</span>
                      </div>
                      <div>
                        <span className="text-3xl">
                          {" "}
                          {cuurentState === false ? "OFF" : "ON"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <input
                          aria-label="Time"
                          type="time"
                          className="text-4xl"
                          value={offtime}
                          onChange={(e) => setoffTime(e.target.value)}
                        />
                        <span>Set Off Time</span>
                      </div>
                      <div className="flex flex-col">
                        <input
                          aria-label="Time"
                          type="time"
                          className="text-4xl"
                          value={ontime}
                          onChange={(e) => setonTime(e.target.value)}
                        />
                        <span>Set On Time</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <Clock /> Set Time
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="p-4">
                <Card className="flex rounded-lg h-full shadow-md p-8 flex-col justify-between">
                  <CardHeader className="flex justify-center w-full items-center">
                    <CardTitle className="flex gap-2">
                      <Bot /> AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {ailoading ? <Spinner /> : suggestions?.response}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => generateAiSuggestions()}
                    >
                      AI Suggestions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="p-4">
                <Card className="shadow-md h-full p-8">
                  <CardHeader className="flex justify-center items-center w-full">
                    <CardTitle className="flex gap-2">
                      <Gauge /> Energy Usage Based
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full flex-grow">
                    <div className="flex flex-row max-w-md mx-auto justify-center space-x-10 items-center w-full">
                      <div className="flex flex-col gap-2 items-center">
                        <span className="md:text-4xl text-2xl font-bold">
                          {energy}
                        </span>
                        <span className="font-bold text-xl">Wh</span>
                      </div>

                      <div>
                        <div className="flex flex-col gap-1 md:mb-3 items-center justify-center">
                          <input
                            type="number"
                            className="md:text-4xl text-2xl  md:w-28 w-20 p-0 m-0 border-0 font-bold mt-3"
                            title="units"
                            value={maxenergy}
                            onChange={(e) => setmaxenergy(e.target.value)}
                            placeholder="300"
                          />
                          <span className="font-bold text-xl mt-1">
                            Turn off Wh
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2 items-center">
                      <Gauge /> Set Units
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
