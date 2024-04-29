import { GetListProductAction } from "@/actions/product/get";
import ProductTable from "@/components/admin/table/product";
import { IPageProps } from "@/interfaces";
import { pick } from "lodash";
import { PRODUCT_LIMIT } from "@/actions/product";
import { PRODUCT_STATUS } from "@prisma/client";
import { IGetListProductPayload } from "@/interfaces/product";

async function fetchData(body: IGetListProductPayload) {
  const product_list = await GetListProductAction({
    page: Number(body.page) || 1,
    per_page: Number(body.per_page) || PRODUCT_LIMIT,
    status: body.status || PRODUCT_STATUS.DRAFT,
  });
  return { product_list };
}

export default async function Home(
  props: IPageProps & {
    searchParams: Pick<IPageProps, "searchParams"> & {
      status: PRODUCT_STATUS | undefined;
    };
  },
) {
  const { product_list } = await fetchData(
    pick(props["searchParams"], ["per_page", "page", "status"]),
  );

  return (
    <section>
      <ProductTable
        data={product_list.data.data || []}
        pagination={product_list.data.pagination}
      />
    </section>
  );
}
