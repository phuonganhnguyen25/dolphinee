"use server";

import {ErrorInspection, SuccessInspection} from "@/helpers/response-error";
import {CreateProductValidator} from "@/validators/product";
import {CheckProductName, OnAddCategoryToProduct, OnCreateProduct} from ".";
import {ICreateProductPayload} from "@/interfaces/product";

export async function CreateProductAction(body: ICreateProductPayload) {
  try {
    CreateProductValidator.parse(body);
    await CheckProductName(body);
    const product = await OnCreateProduct(body);
    if (body.category_id > 0 && product?.id) {
      await OnAddCategoryToProduct({category_id: body.category_id, product_id: product.id})
    }
    return SuccessInspection<any>("Success.Create_Product", body, {});
  } catch (e) {
    return ErrorInspection<any>(e);
  }
}
