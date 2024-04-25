"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { IChangeCategoryOrderPayload } from "@/interfaces/category";
import { prismaClientSingleton } from "@/prisma_client";
import { NewestCategoryOrder } from ".";

export async function OnChangeOrderCategory(body: IChangeCategoryOrderPayload) {
  try {
    const category = await prismaClientSingleton.category.findUnique({
      where: {
        id: body.category_id,
      },
    });
    const target = await prismaClientSingleton.category.findFirst({
      where: {
        order: body.next_order,
      },
    });

    if (!category || !target) throw new Error("Error_Category_Not_Found");

    return await prismaClientSingleton
      .$transaction([
        prismaClientSingleton.category.update({
          where: {
            id: category.id,
          },
          data: {
            order: await NewestCategoryOrder(),
          },
        }),
        prismaClientSingleton.category.update({
          where: {
            id: target.id,
          },
          data: {
            order: category.order,
          },
        }),
      ])
      .then(async () => {
        await prismaClientSingleton.category.update({
          where: {
            id: category.id,
          },
          data: {
            order: target.order,
          },
        });

        return SuccessInspection<any>("Success.Change_Category_Order", [], {});
      });
  } catch (e: any) {
    return ErrorInspection<any>(e);
  }
}
