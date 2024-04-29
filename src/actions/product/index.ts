import { SKUGenerator } from "@/helpers/sku-generator";
import {
  ICreateProductPayload,
  IGetListProductPayload,
  IProduct,
  IUpdateProductPayload,
} from "@/interfaces/product";
import { prismaClientSingleton } from "@/prisma_client";
import { isEmpty, pick } from "lodash";
import { Product } from "@prisma/client";
import { DBNameChecker } from "@/helpers/db-name-checker";

const productEntity = prismaClientSingleton.product;

const SELECT = {
  id: true,
  name: true,
  price_en: true,
  price_vi: true,
  description: true,
  status: true,
  sku: true,
  is_new: true,
  created_at: true,
  updated_at: true,
  product_category: {
    select: {
      id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export const PRODUCT_LIMIT = 5;

export async function PAYLOAD_PRODUCT_DEFAULT(): Promise<ICreateProductPayload> {
  return {
    name_en: "",
    name_vi: "",
    price_en: 0,
    price_vi: 0,
    description: "",
    is_new: true,
    category_id: 0,
  };
}

export async function CheckProductName(
  body: Partial<Pick<ICreateProductPayload, "name_en" | "name_vi">>,
): Promise<string[]> {
  if (isEmpty(body)) return [];

  const checker: any = DBNameChecker(body);
  const res = (await productEntity.findMany({
    where: {
      OR: checker,
    },
    select: {
      id: true,
      name: true,
    },
  })) as Pick<IProduct, "id" | "name">[] | any;

  return res.map((duplicate: Pick<IProduct, "id" | "name">) => {
    if (duplicate.name.name_en === body.name_en) {
      return "name_en";
    } else if (duplicate.name.name_vi === body.name_vi) {
      return "name_vi";
    }
  });
}

export async function OnCreateProduct(
  body: Pick<
    ICreateProductPayload,
    "description" | "is_new" | "name_en" | "name_vi" | "price_en" | "price_vi"
  >,
): Promise<Product | any> {
  try {
    return await productEntity
      .create({
        data: {
          name: {
            name_en: body.name_en,
            name_vi: body.name_vi,
          } as any,
          price_en: body.price_en,
          price_vi: body.price_vi,
          is_new: body.is_new,
          description: body.description,
          sku: "",
        },
      })
      .then(async ({ id }) => {
        return productEntity.update({
          where: { id },
          data: { sku: SKUGenerator(id) },
        });
      });
  } catch (e) {
    throw e;
  }
}

export async function OnGetTotalProduct({
  status,
}: Pick<IGetListProductPayload, "status">) {
  try {
    return await productEntity.count({ where: { status } });
  } catch (e) {
    throw e;
  }
}

export async function OnGetListProduct({
  page,
  per_page,
  status,
}: IGetListProductPayload) {
  const limit = per_page || PRODUCT_LIMIT;
  try {
    return await productEntity.findMany({
      take: per_page,
      skip: page * limit - limit,
      where: {
        status,
      },
      select: {
        ...pick(SELECT, [
          "id",
          "name",
          "price_en",
          "price_vi",
          "description",
          "status",
          "sku",
          "is_new",
          "created_at",
          "updated_at",
          "product_category",
        ]),
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function OnAddCategoryToProduct(
  body: Pick<ICreateProductPayload, "category_id"> & { product_id: number },
) {
  try {
    return await prismaClientSingleton.productCategory.create({
      data: {
        category_id: body.category_id,
        product_id: body.product_id,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function OnGetProductById(body: { id: number }) {
  try {
    return await productEntity.findUnique({
      where: { id: body.id },
      select: {
        ...pick(SELECT, [
          "id",
          "name",
          "price_en",
          "price_vi",
          "description",
          "status",
          "sku",
          "is_new",
          "created_at",
          "updated_at",
          "product_category",
        ]),
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function OnUpdateProduct(body: IUpdateProductPayload, id: number) {
  return productEntity.update({
    where: { id },
    data: body,
    include: {
      product_category: true,
    },
  });
}

export async function OnUpdateProductCategory(
  body: Partial<Pick<ICreateProductPayload, "category_id">> & {
    product_id: number;
  },
) {
  try {
    return await prismaClientSingleton.productCategory.update({
      where: {
        product_id: body.product_id,
      },
      data: {
        category_id: body.category_id,
      },
    });
  } catch (e) {
    throw e;
  }
}
