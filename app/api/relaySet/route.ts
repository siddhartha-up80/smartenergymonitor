

export const POST = async (request: any, response: any) => {
  try {
    // console.log(JSON.stringify(request.json()));
    const { state } = await request.json();

    console.log("state to set: ", state);

    const response = await fetch(
      "https://espenergymonitor.vercel.app/api/relaySet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: state }),
      }
    );

    if (response.ok) {
      console.log("state set successfully");
       return new Response(
         JSON.stringify({ message: "state set successfully" }, ),
         { status: 200 }
       );
    }
    // Respond with a success message
   
  } catch (error) {
    return new Response("Failed to add energy data", {
      status: 500,
    });
  }
};
