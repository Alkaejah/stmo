import { API_URL_TREASURER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getReceiptById(receiptId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_TREASURER_MODULE}/receipts/generated/${receiptId}`,
  );
}

function useGetReceiptById(receiptId: string | undefined) {
  const query = useQuery({
    queryKey: ["receipt", receiptId],
    queryFn: () => getReceiptById(receiptId),
    enabled: !!receiptId,
  });
  return query;
}
export default useGetReceiptById;
