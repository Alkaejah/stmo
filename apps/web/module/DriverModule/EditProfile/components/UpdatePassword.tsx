"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useUpdateAccountPassword from "@/common/hooks/Drivers/useUpdateAccountPassword";
import { T_Back_Officer_Change_Password } from "@repo/contract";
import {
  LucideAlertCircle,
  LucideArrowLeft,
  LucideEye,
  LucideEyeOff,
  LucideRefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const router = useRouter();
  const { mutateAsync: updatePassword } = useUpdateAccountPassword();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<T_Back_Officer_Change_Password>();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);

  const onSubmit = async (formData: T_Back_Officer_Change_Password) => {
    try {
      setIsLoading(true);

      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("New password and confirm password did not match!");
        setIsLoading(false);
        return;
      }

      const response = await updatePassword(formData);

      if (response?.error) {
        toast.error(
          "Change password failed! Old password might not be correct!",
        );
      } else {
        toast.success("Change password successful!");
        setTimeout(() => {
          router.push("/");
        }, 2000);
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
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
        <div className="relative z-10 w-full max-w-full h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex justify-center text-center mb-4">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-10 md:p-10 lg:p-10 w-full max-w-6xl mt-4">
              <Typography
                variant="h2"
                fontWeight="bold"
                className="text-center mb-4 text-lg sm:text-lg md:text-xl lg:text-2xl px-4"
              >
                Update Password
              </Typography>

              <div className="flex gap-1 justify-center sm:justify-start">
                <LucideAlertCircle size={16} className="text-gray-500" />
                <Typography className="text-xs italic text-gray-600">
                  Use a mix of uppercase, lowercase, numbers, and symbols to{" "}
                  <br />
                  create a strong password.
                </Typography>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:items-start items-center space-y-2 w-full">
                    <label
                      htmlFor="currentPassword"
                      className="block text-gray-700 font-bold text-center sm:text-left w-full"
                    >
                      Current Password
                    </label>
                    <div className="relative w-full">
                      <Input
                        required
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("currentPassword", {
                          required: "Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isPasswordVisible ? (
                          <LucideEye size={20} />
                        ) : (
                          <LucideEyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-start items-center space-y-2 w-full">
                    <label
                      htmlFor="newPassword"
                      className="block text-gray-700 font-bold text-center sm:text-left w-full"
                    >
                      New Password
                    </label>
                    <div className="relative w-full">
                      <Input
                        required
                        type={isNewPasswordVisible ? "text" : "password"}
                        {...register("newPassword", {
                          required: "Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isNewPasswordVisible ? (
                          <LucideEye size={20} />
                        ) : (
                          <LucideEyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-start items-center space-y-2 w-full">
                    <label
                      htmlFor="confirmNewPassword"
                      className="block text-gray-700 font-bold text-center sm:text-left w-full"
                    >
                      Confirm Password
                    </label>
                    <div className="relative w-full">
                      <Input
                        required
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        {...register("confirmNewPassword", {
                          required: "Confirm Password is required!",
                        })}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isConfirmPasswordVisible ? (
                          <LucideEye size={20} />
                        ) : (
                          <LucideEyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-32 sm:w-auto bg-secondary hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <LucideRefreshCw size={18} /> Update
                      </>
                    )}
                  </Button>
                  <Link href={`/driver`} className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      type="button"
                      className="w-full md:w-32 sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                    >
                      <LucideArrowLeft size={18} /> Back
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default UpdatePassword;
