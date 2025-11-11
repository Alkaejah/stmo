"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useAddReceipt from "@/common/hooks/Treasurers/useAddReceipt";
import { T_Receipt } from "@repo/contract";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const TreasurerGenerateReceipt = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: generateTicket } = useAddReceipt();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T_Receipt>();

  const onSubmit = async (formData: T_Receipt) => {
    try {
      setIsLoading(true);
      const modifiedFormData = {
        ...formData,
        ticketNumber: formData.ticketNumber.trim(),
        agency: formData.agency.trim(),
      };
      const response = await generateTicket(modifiedFormData);
      if (!response.error) {
        toast.success("Receipt generated successfully. Redirecting...");
        reset({ ticketNumber: "", agency: "" });
        const ticketId = response?.item?._id;
        router.push(`/treasurer/generate-receipt/${ticketId}/preview`);
      } else {
        toast.error(`Receipt for the giver ticket number was already created!`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectBack = () => {
    router.push("/treasurer/dashboard");
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-4xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-2xl mx-auto">
              <div className="text-center">
                <Typography variant="h4">TANGGAPAN NG PUNUMBAYAN</Typography>
                <Typography variant="h5">SINILOAN, LAGUNA</Typography>
              </div>
              <Typography
                variant="h3"
                fontWeight="bold"
                className="my-4 text-center"
              >
                OFFICIAL RECEIPT
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-gray-700  mb-2 mt-2">
                        Ticket Number
                      </label>
                      <Input
                        required
                        type="text"
                        className="w-full"
                        {...register("ticketNumber", {
                          required: "This field is required!",
                        })}
                        placeholder="Enter Ticket Number"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-gray-700  mb-2 mt-2">
                        Agency
                      </label>
                      <Input
                        required
                        type="text"
                        className="w-full"
                        {...register("agency", {
                          required: "This field is required!",
                        })}
                        placeholder="Enter Agency"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                  >
                    Generate Receipt
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRedirectBack}
                  >
                    Back
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

export default TreasurerGenerateReceipt;
