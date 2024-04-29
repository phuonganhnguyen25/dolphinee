export const GetLayoutMetadata: any = (pathname: string) => {
  const path_slit = pathname.split("/");
  let sidebar_active_key = "1";

  if (path_slit.includes("category")) {
    sidebar_active_key = "2";
  } else if (path_slit.includes("product")) {
    sidebar_active_key = "3";
  }

  return { sidebar_active_key };
};
