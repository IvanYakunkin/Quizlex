import { getLanguages } from "@/services/languageService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const languages = await getLanguages();
    
    return NextResponse.json(languages, { status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}