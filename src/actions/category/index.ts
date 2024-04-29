"use server";
import _, { pick } from "lodash";
import {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/interfaces/category";
import { prismaClientSingleton } from "@/prisma_client";
import { DBNameChecker } from "@/helpers/db-name-checker";

const SELECT = {
  id: true,
  name: true,
  order: true,
  level: true,
  created_at: true,
  updated_at: true,
};

export async function PAYLOAD_CATEGORY_DEFAULT(): Promise<ICreateCategoryPayload> {
  return {
    name_en: "",
    name_vi: "",
    parent_id: 0,
  };
}

export async function CheckCategoryName(
  body: Partial<Pick<ICreateCategoryPayload, "name_en" | "name_vi">>,
): Promise<string[]> {
  if (_.isEmpty(body)) return [];

  const checker: any = DBNameChecker(body);
  const res = (await prismaClientSingleton.category.findMany({
    where: {
      OR: checker,
    },
    select: {
      id: true,
      name: true,
    },
  })) as Pick<ICategory, "id" | "name">[] | any;

  return res.map((duplicate: Pick<ICategory, "id" | "name">) => {
    if (duplicate.name.name_en === body.name_en) {
      return "name_en";
    } else if (duplicate.name.name_vi === body.name_vi) {
      return "name_vi";
    }
  });
}

export async function NewestCategoryOrder() {
  const order =
    (
      await prismaClientSingleton.category.aggregate({
        _max: {
          order: true,
        },
      })
    )._max.order || 0;

  return order + 1;
}

export async function OnCreateCategory(
  body: ICreateCategoryPayload & Pick<ICategory, "level" | "order">,
) {
  return prismaClientSingleton.category.create({
    data: {
      name: {
        name_en: body.name_en,
        name_vi: body.name_vi,
      } as any,
      order: body.order,
      level: body.level,
      parent_id: body.parent_id === 0 ? null : body.parent_id,
    },
  });
}

export async function OnGetListCategoryWithLevel(level: number) {
  return prismaClientSingleton.category.findMany({
    where: {
      level,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      ...pick(SELECT, [
        "id",
        "name",
        "level",
        "order",
        "created_at",
        "updated_at",
      ]),
      _count: {
        select: {
          children: true,
        },
      },
    },
  });
}

export async function OnGetListCategoryAllLevel() {
  return prismaClientSingleton.category.findMany({
    orderBy: {
      order: "asc",
    },
    select: {
      ...pick(SELECT, ["id", "name", "level", "created_at", "updated_at"]),
    },
  });
}

export async function OnGetCategoryById(id: number) {
  return prismaClientSingleton.category.findUnique({
    where: {
      id,
    },
    select: {
      ...pick(SELECT, [
        "id",
        "name",
        "level",
        "order",
        "created_at",
        "updated_at",
      ]),
      parent: {
        select: {
          ...pick(SELECT, ["id", "name", "level", "order"]),
        },
      },
      children: {
        orderBy: {
          order: "asc",
        },
        select: {
          ...pick(SELECT, ["id", "name", "level", "order"]),
        },
      },
    },
  });
}

export async function OnUpdateCategory(
  body: IUpdateCategoryPayload,
  id: number,
) {
  try {
    let level = 1;
    if (body.parent_id) {
      const category = await OnGetCategoryById(body.parent_id);
      level = category ? category?.level + 1 : 1;
      // if (category?.children?.length) {
      //   await prismaClientSingleton.category.updateMany({
      //     where: {
      //       id: {
      //         in: category.children.map((x) => x.id),
      //       },
      //     },
      //     data: { parent_id: body.parent_id },
      //   });
      // }
    }

    await prismaClientSingleton.category.update({
      where: { id },
      data: { ...body, level },
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function OnMoveChildCategory(
  child_ids: number[],
  parent_id: number,
) {
  try {
    await prismaClientSingleton.category.updateMany({
      where: {
        id: {
          in: child_ids,
        },
      },
      data: { parent_id },
    });
    return true;
  } catch (e) {
    return false;
  }
}
