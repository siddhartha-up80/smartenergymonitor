import Power from "@/models/power";
import { connectToDB } from "@/utils/database";

export const POST = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));
    const { power } = await request.json();

    console.log(`Power: ${power}W`);

    await connectToDB();

    // Check if there is existing data
    let existingPower = await Power.findOne();

    if (existingPower) {
      // If data exists, update the energyUnits field

      existingPower.power = power;
      await existingPower.save();
    } else {
      // If no data exists, create a new entry
      const powerdata = new Power({
        power,
      });
      await powerdata.save();
    }

    return new Response(
      JSON.stringify({ message: "Power Data received successfully" }, power),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to add Power data", {
      status: 500,
    });
  }
};

export const GET = async (request: any, response: any) => {
  try {
    await connectToDB();

    const latestPowerData = await Power.findOne().sort({ _id: -1 });

    return new Response(JSON.stringify(latestPowerData), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch latest power data", { status: 500 });
  }
};
