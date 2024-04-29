import { PAYLOAD_PRODUCT_DEFAULT } from "@/actions/product";
import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/admin/loading/skeleton";

const CreateProductForm = dynamic(
  () => import("@/components/admin/form/product"),
  {
    loading: () => <SkeletonLoading />,
    ssr: false,
  },
);

async function fetchData() {
  return {
    default_value: await PAYLOAD_PRODUCT_DEFAULT(),
  };
}

export default async function Home() {
  const { default_value } = await fetchData();

  return (
    <section>
      <CreateProductForm defaultFormValue={default_value} id={null} />
    </section>
  );
}
