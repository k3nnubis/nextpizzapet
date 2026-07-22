import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        {
          error: "Код неверный или не существует!",
        },
        { status: 400 },
      );
    }
    const verCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verCode) {
      return NextResponse.json(
        {
          error: "Код неверный или не существует!",
        },
        { status: 400 },
      );
    }
    await prisma.user.update({
      where: {
        id: verCode.userId,
      },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verCode.id,
      },
    });

    return NextResponse.redirect(new URL("/?verified", req.url));
  } catch (error) {
    console.log("ERROR [AUTH_VERIFY]", error);
  }
}
