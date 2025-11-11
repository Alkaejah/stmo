import { API_URL_DRIVER_MODULE, API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllViolationsRecord() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_DRIVER_MODULE}/violations-record`);
}

function useGetAllViolationsRecord() {
  const query = useQuery({
    queryKey: ["violations-record"],
    queryFn: () => getAllViolationsRecord(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllViolationsRecord;
