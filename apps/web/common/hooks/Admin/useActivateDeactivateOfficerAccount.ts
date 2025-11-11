import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Account_Status } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function activateDeactivateOfficerAccount(
  backOfficerId: string | undefined,
  props: T_Update_Account_Status,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_ADMIN_MODULE}/accounts/officers/status/${backOfficerId}`,
    props,
  );
}

function useActivateDeactivateOfficerAccount(
  backOfficerId: string | undefined,
) {
  const query = useMutation({
    mutationFn: (props: T_Update_Account_Status) =>
      activateDeactivateOfficerAccount(backOfficerId, props),
  });
  return query;
}

export default useActivateDeactivateOfficerAccount;
