import { API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Change_Password } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateAccountPassword(props: T_Change_Password) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_DRIVERS}/auth/change-password`,
    props,
  );
}

function useUpdateAccountPassword() {
  const query = useMutation({
    mutationFn: (props: T_Change_Password) => updateAccountPassword(props),
  });
  return query;
}
export default useUpdateAccountPassword;
