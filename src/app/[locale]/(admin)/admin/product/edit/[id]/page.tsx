import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/admin/loading/skeleton";
import { IPageProps } from "@/interfaces";
import { GetProductByIdAction } from "@/actions/product/get";
import { ICreateProductPayload } from "@/interfaces/product";
import { redirect } from "next/navigation";

const CreateProductForm = dynamic(
  () => import("@/components/admin/form/product"),
  {
    loading: () => <SkeletonLoading />,
    ssr: false,
  },
);

type Fetch_Prop = {
  product_id: number;
};

async function fetchData(
  body: Fetch_Prop,
): Promise<{ default_value: ICreateProductPayload | null }> {
  const product = (await GetProductByIdAction({ id: body.product_id }))?.data
    ?.data;
  let default_value: ICreateProductPayload | null = null;

  if (product) {
    default_value = {
      name_en: product.name?.name_en || "",
      name_vi: product.name?.name_vi || "",
      price_en: product.price_en || 0,
      price_vi: product.price_vi || 0,
      description: product.description || "",
      is_new: product.is_new || false,
      category_id: product.product_category?.category.id || 0,
    };
  }

  return {
    default_value,
  };
}

export default async function Home(props: IPageProps) {
  const { default_value } = await fetchData({
    product_id: Number(props.params.id),
  });

  if (!default_value) redirect(`/${props.params.locale}/admin/product/list `);

  return (
    <section>
      <CreateProductForm
        defaultFormValue={default_value}
        id={Number(props.params.id)}
      />
    </section>
  );
}
