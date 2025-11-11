import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Back_Officer_Verify_Forgot_Password } from "@repo/contract";
import { API_BACKOFFICE_AUTH } from "./constants/api-routes";

export async function BackOfficerVerifyForgotPassword(
  props: T_Back_Officer_Verify_Forgot_Password,
) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_BACKOFFICE_AUTH}/forgot-password/verify`,
    props,
  );
}

function useBackOfficerVerifyForgotPassword() {
  const query = useMutation({
    mutationFn: (props: T_Back_Officer_Verify_Forgot_Password) =>
      BackOfficerVerifyForgotPassword(props),
  });
  return query;
}

export default useBackOfficerVerifyForgotPassword;
