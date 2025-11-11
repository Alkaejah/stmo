import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Back_Officer_Forgot_Password } from "@repo/contract";
import { API_AUTH_FORGOT_PASSWORD } from "./constants/api-routes";

export async function backOfficerForgotPassword(
  props: T_Back_Officer_Forgot_Password,
) {
  const apiService = new ApiService();
  return await apiService.post(API_AUTH_FORGOT_PASSWORD, props);
}

function useBackOfficerForgotPassword() {
  const query = useMutation({
    mutationFn: (props: T_Back_Officer_Forgot_Password) =>
      backOfficerForgotPassword(props),
  });
  return query;
}

export default useBackOfficerForgotPassword;
