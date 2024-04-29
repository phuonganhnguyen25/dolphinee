import { IDBFieldName } from "@/interfaces";

export function DBNameChecker(body: Partial<IDBFieldName>) {
  const checker = [];

  if (body?.name_en && !body?.name_vi) {
    checker.push([
      {
        name: {
          path: ["name_en"],
          equals: body.name_en,
        },
      },
    ]);
  } else if (!body?.name_en && body?.name_vi) {
    checker.push({
      name: {
        path: ["name_vi"],
        equals: body.name_vi,
      },
    });
  } else {
    checker.push(
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
    );
  }

  return checker;
}
