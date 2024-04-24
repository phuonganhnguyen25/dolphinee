export const GetLayoutMetadata: any = (pathname: string) => {
  const path_slit = pathname.split("/");
  let sidebar_active_key = "1";

  if (path_slit.includes("category")) {
    sidebar_active_key = "2";
  }

  return { sidebar_active_key };
};
