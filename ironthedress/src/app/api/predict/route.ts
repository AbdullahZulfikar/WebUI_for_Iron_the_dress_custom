import { NextResponse, NextRequest } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const data = await req.json();
    const replicate = new Replicate({
      auth: "r8_GVlRUmvWt5bur5nECwmbfGO8TcK5Cv64A9riQ",
    });

    const output = await replicate.run(
      "shivansh-yadav13/iron-the-dress:33757df23f3c36414a02ae99701f1c2dd1d4c3eddd29b5ae04fa0ed145044441",
      {
        input: {
          input_image_base64: data.input_image,
          mask_base64: data.mask_image,
        }
      }
    );
    console.log(output);
    return new NextResponse(JSON.stringify({ output_base64: output }));
  } else {
    return new NextResponse(JSON.stringify({ output_base64: null }));
  }
}