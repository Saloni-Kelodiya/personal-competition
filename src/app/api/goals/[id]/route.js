import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single goal
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const goal = await prisma.goal.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!goal) {
      return NextResponse.json(
        {
          success: false,
          error: "Goal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error("GET SINGLE GOAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch goal",
      },
      { status: 500 }
    );
  }
}

// PUT - update goal
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const goal = await prisma.goal.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(body.title !== undefined && {
          title: body.title,
        }),

        ...(body.description !== undefined && {
          description: body.description,
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

        ...(body.deadline !== undefined && {
          deadline: body.deadline
            ? new Date(body.deadline)
            : null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error("UPDATE GOAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update goal",
      },
      { status: 500 }
    );
  }
}

// DELETE - delete goal
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.goal.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("DELETE GOAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete goal",
      },
      { status: 500 }
    );
  }
}