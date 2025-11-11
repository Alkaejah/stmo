import { API_URL_BACKOFFICE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Back_Officer_Change_Password } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateBackOfficerAccountPassword(
  props: T_Back_Officer_Change_Password,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_BACKOFFICE}/auth/change-password`,
    props,
  );
}

function useUpdateBackOfficerAccountPassword() {
  const query = useMutation({
    mutationFn: (props: T_Back_Officer_Change_Password) =>
      updateBackOfficerAccountPassword(props),
  });
  return query;
}
export default useUpdateBackOfficerAccountPassword;
