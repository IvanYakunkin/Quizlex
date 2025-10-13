import { deleteCardFavorite, isCardFavorite, setCardFavorite } from "@/services/favoriteService";
import { findUserIdByEmail } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userEmail, moduleId, wordId } = await req.json();

    const userId = await findUserIdByEmail(userEmail);
    
    if(!userId){
      return NextResponse.json({error: "Unable to find user"}, {status: 404});
    }

    if(await isCardFavorite(userId, wordId)){
      const deletedFavorite = deleteCardFavorite(userId, wordId);
      if(deletedFavorite){
          return NextResponse.json(deletedFavorite, {status: 201});
      }
    }else{
      const createdFavorite = await setCardFavorite(userId, moduleId, wordId);
      if(createdFavorite){
          return NextResponse.json(createdFavorite, {status: 201});
      }  
    }
    
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}