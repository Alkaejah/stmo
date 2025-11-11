import { API_URL_BACKOFFICE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Back_Officer_Personal_Info } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateBackOfficerInfo(
  backOfficerId: string | undefined,
  props: T_Update_Back_Officer_Personal_Info,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_BACKOFFICE}/auth/${backOfficerId}/personal-info`,
    props,
  );
}

function useUpdateBackOfficerInfo(backOfficerId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Update_Back_Officer_Personal_Info) =>
      updateBackOfficerInfo(backOfficerId, props),
  });
  return query;
}

export default useUpdateBackOfficerInfo;
