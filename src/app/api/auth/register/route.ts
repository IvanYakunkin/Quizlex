import { createUser } from '@/services/userService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, login } = await req.json();

    if (!email || !password || !login) {
      return NextResponse.json({ error: 'Fill the fields!' }, { status: 400 });
    }
    if(password.length <= 4){
      return NextResponse.json({error: "The password must contain at least 5 characters!"}, {status: 400});
    }

    const newUser = await createUser(login, email, "credentials", password);

    return NextResponse.json(newUser, { status: 201 }); 

  } catch (error) {

      console.error(error);
      if(error instanceof Error){  
        if(error.message === "Email is already in use!"){
          return NextResponse.json({error: error.message}, {status: 409});
        }
        if(error.message === "Login is already in use!"){
          return NextResponse.json({error: error.message}, {status: 409});
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}