"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { ICategory } from "@/interfaces/category";
import { prismaClientSingleton } from "@/prisma_client";

export async function DeleteCategoryAction(body: Pick<ICategory, "id">) {
  try {
    await prismaClientSingleton.category.delete({
      where: {
        id: body.id,
      },
    });
    return SuccessInspection<any>("Success.Delete_Category", [], {});
  } catch (e) {
    return ErrorInspection<any>(e);
  }
}
