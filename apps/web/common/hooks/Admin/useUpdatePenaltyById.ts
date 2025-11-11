import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Penalty } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updatePenaltyById(
  penaltyId: string | undefined,
  props: T_Update_Penalty,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_ADMIN_MODULE}/settings/penalties/${penaltyId}`,
    props,
  );
}

function useUpdatePenaltyById(penaltyId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Update_Penalty) =>
      updatePenaltyById(penaltyId, props),
  });
  return query;
}

export default useUpdatePenaltyById;
