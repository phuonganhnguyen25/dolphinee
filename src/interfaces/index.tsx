export interface IPageParams {
  locale: string;
}

export interface IDBFieldName {
  name_en: string;
  name_vi: string;
}

export interface IResponse<TData> {
  status: boolean;
  type: "db" | "validation" | "error" | "common" | "success" | "unknown";
  errors: any[];
  message: string;
  data: {
    data: TData;
    pagination: {
      page: number;
      per_page: number;
      total: number;
    };
  };
}
