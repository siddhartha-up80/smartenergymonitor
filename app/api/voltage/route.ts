import Voltage from "@/models/voltage";
import { connectToDB } from "@/utils/database";

export const POST = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));
    const { voltage } = await request.json();

    console.log(`Voltage: ${voltage}V`);

    await connectToDB();

    // Check if there is existing data
    let existingVoltage = await Voltage.findOne();

    if (existingVoltage) {
      // If data exists, update the energyUnits field

      existingVoltage.voltage = voltage;
      await existingVoltage.save();
    } else {
      // If no data exists, create a new entry
      const voltagedata = new Voltage({
        voltage,
      });
      await voltagedata.save();
    }

    return new Response(
      JSON.stringify(
        { message: "Voltage Data received successfully" },
        voltage
      ),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to add Voltage data", {
      status: 500,
    });
  }
};

export const GET = async (request: any, response: any) => {
  try {
    await connectToDB();

    const latestvoltageData = await Voltage.findOne().sort({ _id: -1 });

    return new Response(JSON.stringify(latestvoltageData), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch latest voltage data", { status: 500 });
  }
};
