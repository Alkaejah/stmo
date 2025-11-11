import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { API_AUTH_FORGOT_PASSWORD } from "./constants/api-routes";
import { T_Forgot_Password } from "@repo/contract";

export async function forgotPassword(props: T_Forgot_Password) {
  const apiService = new ApiService();
  return await apiService.post(API_AUTH_FORGOT_PASSWORD, props);
}

function useForgotPassword() {
  const query = useMutation({
    mutationFn: (props: T_Forgot_Password) => forgotPassword(props),
  });
  return query;
}

export default useForgotPassword;
