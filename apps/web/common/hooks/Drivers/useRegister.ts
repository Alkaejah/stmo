import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Driver_Register } from "@repo/contract";
import { API_URL_DRIVERS } from "@/common/constants";

export async function registerUser(props: T_Driver_Register) {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_DRIVERS}/auth/register`, props);
}

function useRegister() {
  const query = useMutation({
    mutationFn: (props: T_Driver_Register) => registerUser(props),
  });
  return query;
}

export default useRegister;
