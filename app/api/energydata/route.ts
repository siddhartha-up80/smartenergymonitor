import Energy from "@/models/energydata";
import { connectToDB } from "@/utils/database";

export const POST = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));
    const { voltage, current, power, energy } = await request.json();

    console.log(
      `Voltage: ${voltage}V, Current: ${current}A, Power: ${power}W, Energy: ${energy}kWh`
    );

    await connectToDB();

    const energydata = new Energy({
      voltage,
      current,
      power,
      energy,
    });

    await energydata.save();
    // Respond with a success message
    return new Response(
      JSON.stringify({ message: "Data received successfully" }, energydata),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to add energy data", {
      status: 500,
    });
  }
};

export const GET = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));

    await connectToDB();

    const energydata = await Energy.findOne().sort({ time: -1 });

    // Respond with a success message
    return new Response(JSON.stringify(energydata), { status: 200 });
  } catch (error) {
    return new Response("Failed to add energy data", {
      status: 500,
    });
  }
};
