"use server";
import _, { pick } from "lodash";
import { ICategory, ICreateCategoryPayload } from "@/interfaces/category";
import { prismaClientSingleton } from "@/prisma_client";

const SELECT = {
  id: true,
  name: true,
  order: true,
  level: true,
  created_at: true,
  updated_at: true,
};

export async function CheckCategoryName(
  body: Partial<Pick<ICreateCategoryPayload, "name_en" | "name_vi">>
): Promise<string[]> {
  if (_.isEmpty(body)) return [];

  let checker = [];

  if (body?.name_en && !body?.name_vi) {
    checker = [
      {
        name: {
          path: ["name_en"],
          equals: body.name_en,
        },
      },
    ];
  } else if (!body?.name_en && body?.name_vi) {
    checker = [
      {
        name: {
          path: ["name_vi"],
          equals: body.name_vi,
        },
      },
    ];
  } else {
    checker = [
      {
        name: {
          path: ["name_en"],
          equals: body.name_en,
        },
      },
      {
        name: {
          path: ["name_vi"],
          equals: body.name_vi,
        },
      },
    ];
  }

  const res = (await prismaClientSingleton.category.findMany({
    where: {
      OR: checker,
    },
    select: {
      id: true,
      name: true,
    },
  })) as Pick<ICategory, "id" | "name">[] | any;

  const duplicate_fields = res.map(
    (duplicate: Pick<ICategory, "id" | "name">) => {
      if (duplicate.name.name_en === body.name_en) {
        return "name_en";
      } else if (duplicate.name.name_vi === body.name_vi) {
        return "name_vi";
      }
    }
  );

  return duplicate_fields;
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
  body: ICreateCategoryPayload & Pick<ICategory, "level" | "order">
) {
  return await prismaClientSingleton.category.create({
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
  return await prismaClientSingleton.category.findMany({
    where: {
      level,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      ...pick(SELECT, ["id", "name", "level", "created_at", "updated_at"]),
      children: {
        select: {
          ...pick(SELECT, ["id", "name"]),
        },
      },
    },
  });
}


export async function OnGetListCategoryAllLevel() {
  return await prismaClientSingleton.category.findMany({
    orderBy: {
      order: "asc",
    },
    select: {
      ...pick(SELECT, ["id", "name", "level", "created_at", "updated_at"]),
    },
  });
}
