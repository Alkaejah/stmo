import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Penalty } from "@repo/contract";

export async function addPenalty(props: T_Penalty) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/settings/penalties`,
    props,
  );
}

function useAddPenalty() {
  const query = useMutation({
    mutationFn: (props: T_Penalty) => addPenalty(props),
  });
  return query;
}

export default useAddPenalty;
