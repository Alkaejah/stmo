"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import useRegister from "@/common/hooks/Drivers/useRegister";
import { LucideEye, LucideEyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Define the interface for the payload structure
interface IDriverRegister {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    barangay: string;
    municipality: string;
    province: string;
  };
  username: string;
  password: string;
  confirmPassword?: string;
}

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const RegisterDriver = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { mutateAsync: registerDriver } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IDriverRegister>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (formData: IDriverRegister) => {
    try {
      setIsLoading(true);

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const modifiedFormData = {
        ...formData,
        firstName: capitalizeFirstLetter(formData.firstName),
        lastName: capitalizeFirstLetter(formData.lastName),
        address: {
          street: formData.address.street,
          barangay: formData.address.barangay,
          municipality: formData.address.municipality,
          province: formData.address.province,
        },
      };

      console.log("Submitting Form Data:", modifiedFormData);
      const response = await registerDriver(modifiedFormData);
      console.log("Response:", response);

      // ✅ Check if the error is specifically about username duplication
      if (response?.error) {
      } else {
        toast.success("Registration successful!");
        if (response.action?.link) {
          console.log("Redirecting to:", response.action.link);
          setTimeout(() => {
            window.location.href = response.action?.link || "/";
          }, 2000);
        }

        reset({
          username: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          address: {
            street: "",
            barangay: "",
            municipality: "",
            province: "",
          },
        });
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
      <div className="sm:p-2 md:p-8 w-full flex justify-center">
        <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl mx-auto min-h-[90vh] sm:px-8 lg:p-4 md:px-32 shadow-lg flex justify-center">
          {/* Right Form Section */}

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:pb-8 w-full max-w-3xl">
            <Typography className="text-2xl lg:text-3xl text-center font-bold text-black mb-6">
              SIGN UP
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Name and Address */}
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      First Name
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("firstName", {
                        required: "First Name is required!",
                      })}
                      className="w-full"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Last Name
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("lastName", {
                        required: "Last Name is required!",
                      })}
                      className="w-full"
                    />
                  </div>
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Date of Birth
                    </label>
                    <Input
                      required
                      type="date"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required!",
                      })}
                      className="flex-1 flex-col "
                    />
                  </div>
                  {/* Street */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Street
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("address.street", {
                        required: "Street is required!",
                      })}
                    />
                  </div>

                  {/* Barangay */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Barangay
                    </label>
                    <Input
                      type="text"
                      {...register("address.barangay", {
                        required: "Barangay is required!",
                      })}
                    />
                  </div>
                </div>

                {/* Right Column: Username & Password */}
                <div className="space-y-4">
                  {/* Municipality */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Municipality
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("address.municipality", {
                        required: "Municipality is required!",
                      })}
                    />
                  </div>
                  {/* Province */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Province
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("address.province", {
                        required: "Province is required!",
                      })}
                    />
                  </div>
                  {/* Username */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Username
                    </label>
                    <Input
                      required
                      type="text"
                      {...register("username", {
                        required: "Username is required!",
                      })}
                      className="w-full"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("password", {
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Confirm Password is required!",
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match!",
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
              </div>

              {/* Submit Button */}
              <div className="sm:flex sm:justify-between mt-6">
                <Button
                  type="submit"
                  className="w-32 bg-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
                <Typography fontWeight="semiBold" className="text-gray-700">
                  <Link href={"/"}>
                    Already have an account?{" "}
                    <span className="text-secondary hover:text-blue-300">
                      Login
                    </span>
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDriver;
