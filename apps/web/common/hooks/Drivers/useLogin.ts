import { API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Drivers } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

//TODO: create separate zod type for this

export async function loginUser(props: T_Drivers) {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_DRIVERS}/auth/login`, props);
}
function useLogin() {
  const query = useMutation({
    mutationFn: (props: T_Drivers) => loginUser(props),
  });
  return query;
}

export default useLogin;
