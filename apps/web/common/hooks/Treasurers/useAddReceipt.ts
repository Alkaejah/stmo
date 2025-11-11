import { API_URL_TREASURER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Receipt } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function addReceipt(props: T_Receipt) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_TREASURER_MODULE}/receipts/generate`,
    props,
  );
}

function useAddReceipt() {
  const query = useMutation({
    mutationFn: (props: T_Receipt) => addReceipt(props),
  });
  return query;
}

export default useAddReceipt;
