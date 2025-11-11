import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { API_DRIVERS_AUTH } from "./constants/api-routes";
import { T_Verify_Forgot_Password } from "@repo/contract";

export async function verifyForgotPassword(props: T_Verify_Forgot_Password) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_DRIVERS_AUTH}/forgot-password/verify`,
    props,
  );
}

function useVerifyForgotPassword() {
  const query = useMutation({
    mutationFn: (props: T_Verify_Forgot_Password) =>
      verifyForgotPassword(props),
  });
  return query;
}

export default useVerifyForgotPassword;
