import { API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Personal_Info } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateDriverInfo(
  driverId: string | undefined,
  props: T_Update_Personal_Info,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_DRIVERS}/auth/${driverId}/personal-info`,
    props,
  );
}

function useUpdateDriverInfo(driverId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Update_Personal_Info) =>
      updateDriverInfo(driverId, props),
  });
  return query;
}

export default useUpdateDriverInfo;
