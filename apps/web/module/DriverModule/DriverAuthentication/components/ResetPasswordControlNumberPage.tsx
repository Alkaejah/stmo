"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useForgotPassword from "@/common/hooks/Drivers/useForgotPassword";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IResetPassword {
  driverControlNumber: string;
}

const ResetPasswordControlNumber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [controlNumber, setControlNumber] = useState<string>("");
  const router = useRouter();
  const { mutateAsync: checkDriverControlNumber } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPassword>();

  const onSubmit = async (formData: IResetPassword) => {
    try {
      setIsLoading(true);
      const modifiedFormData = {
        ...formData,
        controlNumber: controlNumber.trim(),
      };
      const response = await checkDriverControlNumber(modifiedFormData);

      if (!response?.error) {
        // Move localStorage interaction to useEffect
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "controlNumber",
            formData.driverControlNumber.trim(),
          );
        }
        toast.success("Control number verified. Redirecting...");
        setTimeout(() => {
          router.push(
            `/drivers-auth/reset-password-control-number/reset-password`,
          );
        }, 1000);
      } else {
        toast.error("Invalid control number. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-2xl mx-auto">
              <Typography className="text-2xl lg:text-3xl text-center font-bold text-black mb-6">
                RESET PASSWORD
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 mt-2">
                        Driver Control Number
                      </label>
                      <Input
                        required
                        type="text"
                        className="w-full"
                        placeholder="DCN-XXXXXXXXXXXX"
                        {...register("driverControlNumber", {
                          required: "Driver control number is required!",
                          onChange: (e) =>
                            setControlNumber(e.target.value.trim()), // Update controlNumber directly
                        })}
                      />
                      {errors.driverControlNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.driverControlNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between lg:justify-end gap-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-32 bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Reset Password"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-32 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default ResetPasswordControlNumber;
