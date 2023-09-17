import {
  getCityImageFromName,
  getCommuneFromCode,
  getLastWaterTestFromCode,
  getNetworksFromCode,
  getTestCards,
} from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //!change method to GET to trigger nextjs route caching on client using query params in url

  try {
    const body = await req.json();
    const { type, ...rest } = body;

    switch (type) {
      case "commune":
        return NextResponse.json(await getCommuneFromCode(rest.code));
      case "cityImage":
        return NextResponse.json(
          await getCityImageFromName(rest.name, rest.departement),
        );
      case "waterTest":
        return NextResponse.json(await getLastWaterTestFromCode(rest.code));
      case "networks":
        return NextResponse.json(await getNetworksFromCode(rest.code));
      case "cards":
        return NextResponse.json(await getTestCards(rest.code));
      default:
        break;
    }
  } catch (error) {}
}
