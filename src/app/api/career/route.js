import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Career skills
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required",
        },
        { status: 400 }
      );
    }

    const skills = await prisma.careerprogress.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("GET CAREER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch career progress",
      },
      { status: 500 }
    );
  }
}

// POST - Create skill
export async function POST(request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);

    if (!userId || !body.skill || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, skill and category are required",
        },
        { status: 400 }
      );
    }

    const skill = await prisma.careerprogress.create({
      data: {
        userId,
        skill: body.skill,
        category: body.category,
        progress:
          body.progress !== undefined
            ? Number(body.progress)
            : 0,
        target:
          body.target !== undefined
            ? Number(body.target)
            : 100,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE CAREER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create career skill",
      },
      { status: 500 }
    );
  }
}