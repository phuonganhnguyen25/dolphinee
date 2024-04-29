"use server";

import { ErrorInspection, SuccessInspection } from "@/helpers/response-error";
import { OnGetListProduct, OnGetProductById, OnGetTotalProduct } from ".";
import { GetListProductValidator } from "@/validators/product";
import { IGetListProductPayload, IProduct } from "@/interfaces/product";
import { ThrowError } from "@/helpers/throw-error";

export async function GetListProductAction(body: IGetListProductPayload) {
  try {
    GetListProductValidator.parse(body);
    const res: any = await OnGetListProduct(body);
    return SuccessInspection<IProduct[]>("Success.Get_Product", res, {
      page: body.page,
      per_page: body.per_page,
      total: await OnGetTotalProduct({ status: body.status }),
    });
  } catch (e) {
    return ErrorInspection<IProduct[]>(e);
  }
}

export async function GetProductByIdAction(body: { id: number }) {
  try {
    const product: any = await OnGetProductById(body);
    if (!product) {
      return ThrowError<IProduct>("Error.Get_Product");
    }
    return SuccessInspection<IProduct>("Success.Get_Product", product, {});
  } catch (e) {
    return ErrorInspection<IProduct>(e);
  }
}
