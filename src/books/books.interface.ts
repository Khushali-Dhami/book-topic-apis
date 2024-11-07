export interface GetAllBooks<T> {
  status: string;
  data?: {
    items: T;
    totalEntries: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface GetBook<T> {
  status: string;
  data?: T;
  message?: string;
}
