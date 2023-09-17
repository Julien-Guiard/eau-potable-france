import {
  getCommuneCodeFromPosition,
  getCommunesNamesAlt,
  getConformityList,
} from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, ...rest } = body;

    switch (type) {
      case "communeSearch":
        const { search } = rest;
        return NextResponse.json(await getCommunesNamesAlt(search));
      case "geolocate":
        const { position } = rest;
        return NextResponse.json(await getCommuneCodeFromPosition(position));
      case "conformityList":
        const { zone, conformityType } = rest;
        return NextResponse.json(await getConformityList(conformityType, zone));
      default:
        break;
    }
  } catch (error) {}
}
