import { API_URL_TREASURERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllReceipts() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_TREASURERS}/treasurer-module/receipts/generated/list`,
  );
}

function useGetAllReceipts() {
  const query = useQuery({
    queryKey: ["receipts"],
    queryFn: () => getAllReceipts(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllReceipts;
