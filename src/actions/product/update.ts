"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { keys, omit, pick } from "lodash";
import { UpdateProductValidator } from "@/validators/product";
import {
  CheckProductName,
  OnAddCategoryToProduct,
  OnGetProductById,
  OnUpdateProduct,
  OnUpdateProductCategory,
} from "@/actions/product";
import { IUpdateProductPayload } from "@/interfaces/product";
import { ThrowError, ThrowZodError } from "@/helpers/throw-error";

export async function UpdateProductAction(body: IUpdateProductPayload) {
  try {
    UpdateProductValidator.parse(body);

    const name_keys = keys(pick(body, ["name_en", "name_vi"]));

    if (name_keys.length) {
      const dupName = await CheckProductName(body);
      if (dupName.length) {
        const arr: any = [];
        dupName.map((x) => {
          arr.push({ path: [x], message: "Error.Name_Invalid" });
        });
        ThrowZodError(arr);
      }
    }

    const update_body: any = {};

    if (!body.id) return ThrowError<object>("Error.Update_Product");

    const existing = await OnGetProductById(pick(body, ["id"]));
    if (existing) {
      update_body.name = existing.name;
    }
    //
    name_keys.map((key) => {
      const value: any = body;
      update_body.name[key] = value[key];
    });

    keys(omit(body, ["id", "name_vi", "name_vi", "category_id"])).map((key) => {
      const value: any = body;
      update_body[key] = value[key];
    });
    const product = await OnUpdateProduct(update_body, body.id);
    if (!product) return ThrowError<object>("Error.Update_Product");
    if ("category_id" in body) {
      update_body["category_id"] =
        body.category_id === 0 ? null : body.category_id;
      const action = product.product_category
        ? OnUpdateProductCategory
        : OnAddCategoryToProduct;
      await action({
        category_id: body.category_id,
        product_id: product.id,
      } as any);
    }
    return SuccessInspection<object>("Success.Update_Product", {}, {});
  } catch (e: any) {
    return ErrorInspection<object>(e);
  }
}
