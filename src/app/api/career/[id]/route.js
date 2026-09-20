import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE CAREER SKILL
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const skill = await prisma.careerprogress.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(body.skill !== undefined && {
          skill: body.skill,
        }),

        ...(body.category !== undefined && {
          category: body.category,
        }),

        ...(body.progress !== undefined && {
          progress: Number(body.progress),
        }),

        ...(body.target !== undefined && {
          target: Number(body.target),
        }),

        ...(body.notes !== undefined && {
          notes: body.notes,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("UPDATE CAREER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update career skill",
      },
      { status: 500 }
    );
  }
}

// DELETE CAREER SKILL
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.careerprogress.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Career skill deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CAREER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete career skill",
      },
      { status: 500 }
    );
  }
}