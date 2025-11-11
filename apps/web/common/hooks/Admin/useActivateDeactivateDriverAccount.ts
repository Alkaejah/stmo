import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Account_Status } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function activateDeactivateDriverAccount(
  driverId: string | undefined,
  props: T_Update_Account_Status,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_ADMIN_MODULE}/accounts/drivers/status/${driverId}`,
    props,
  );
}

function useActivateDeactivateDriverAccount(driverId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Update_Account_Status) =>
      activateDeactivateDriverAccount(driverId, props),
  });
  return query;
}

export default useActivateDeactivateDriverAccount;
