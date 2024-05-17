import EnergyUnits from "@/models/energyUnits";
import { connectToDB } from "@/utils/database";

export const POST = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));
    const { voltage, current, power, energyUnits } = await request.json();

    console.log(
      `Voltage: ${voltage}V, Current: ${current}A, Power: ${power}W, Energy: ${energyUnits}kWh`
    );

    await connectToDB();

    // Check if there is existing data
    let existingData = await EnergyUnits.findOne();

    if (existingData) {
      // If data exists, update the energyUnits field
      existingData.voltage = voltage;
      existingData.current = current;
      existingData.power = power;
      existingData.energyUnits = energyUnits;
      await existingData.save();

    } else {
      // If no data exists, create a new entry
      const energydata = new EnergyUnits({
        voltage,
        current,
        power,
        energyUnits,
      });
      await energydata.save();
    }

    return new Response(
      JSON.stringify({ message: "Data received successfully" }, energyUnits),
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
    await connectToDB();

    const energydata = await EnergyUnits.find({})

    return new Response(JSON.stringify(energydata), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all energy data", { status: 500 });
  }
};
