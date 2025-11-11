"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import toast from "react-hot-toast";
import ApprehensionExplanationModal from "./ApprehensionExplanationModal";
import useAddFeedback from "@/common/hooks/Drivers/module/useAddFeedback";
import { useRouter, useSearchParams } from "next/navigation";
import { T_Feedback } from "@repo/contract";

const FeedbackForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm<T_Feedback>({
    defaultValues: { isAccuratelyApprehended: false },
  });

  const searchParams = useSearchParams();
  const enforcerId = searchParams.get("enforcerId");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [userSelection, setUserSelection] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState("");
  const router = useRouter();
  const { mutateAsync: addFeedBack } = useAddFeedback(String(enforcerId));

  useEffect(() => {
    setIsClient(true);
  }, []);
  console.log("explanation: ", explanation);
  const onSubmit = async (data: T_Feedback) => {
    try {
      setIsLoading(true);
      const modifiedFormData = {
        ...data,
        isAccuratelyApprehended: data.isAccuratelyApprehended,
        whyApprehensionIsInAccurate: explanation,
        comments: data.comments || "",
        q1: data.q1,
        q2: data.q2,
        q3: data.q3,
        q4: data.q4,
        q5: data.q5,
        q6: data.q6,
        q7: data.q7,
        q8: data.q8,
        q9: data.q9,
        q10: data.q10,
        q11: data.q11,
      };

      const response = await addFeedBack(modifiedFormData);
      if (!response.error) {
        toast.success("Feedback submitted successfully!");
        router.push(`/driver/records-of-violation`);
      } else {
        toast.error("Failed to submit feedback!");
      }
    } catch (err) {
      toast.error("Failed to submit feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleYesClick = () => {
    setUserSelection(true);
    setValue("isAccuratelyApprehended", true);
    // No modal on 'Yes'
  };

  const handleNoClick = () => {
    setUserSelection(false);
    setValue("isAccuratelyApprehended", false);
    setShowExplanationModal(true); // ✅ Modal appears on 'No' now
  };

  const handleModalSave = (modalExplanation: string) => {
    setExplanation(modalExplanation); // Update state with modal input value
    setShowExplanationModal(false);
  };

  // Watch all radio button fields
  const radioValues = watch([
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "q9",
    "q10",
    "q11",
  ]);
  useEffect(() => {
    console.log("Radio Values:", radioValues);
  }, [radioValues]);

  const likertOptions = [1, 2, 3, 4, 5];

  const questions = [
    {
      category: "I. Professionalism and Conduct",
      items: [
        "Consistently upholds ethical standards by issuing citation tickets fairly, without bias or favoritism.",
        "Handles interactions with violators calmly and respectfully, even in challenging situations.",
        "Strictly follows municipal guidelines in issuing citation tickets, ensuring compliance with legal and procedural standards.",
      ],
    },
    {
      category: "II. Knowledge and Competence",
      items: [
        "Demonstrates a strong understanding of traffic rules, local ordinances, and relevant regulations specific to the municipality.",
        "Assesses situations accurately and makes appropriate decisions when determining violations and issuing citation tickets.",
        "Approaches violators with confidence and ensures efficient issuance of citation tickets to maintain order and compliance.",
      ],
    },
    {
      category: "III. Apprehension and Citation Issuance Skills",
      items: [
        "Proactively monitors traffic and public areas, promptly identifying violators and issuing citation tickets when necessary.",
        "Ensures that all citation tickets are issued with correct details, including the violation, location, and time, minimizing errors.",
        "Maintains a safe environment while issuing citation tickets by minimizing confrontation and ensuring compliance from violators.",
      ],
    },
    {
      category: "IV. Communication and Reporting",
      items: [
        "Explains violations clearly and professionally, ensuring that violators understand the reason for the citation.",
        "Addresses public inquiries about citation procedures and violations with clarity and patience.",
      ],
    },
  ];

  if (!isClient) return null;

  return (
    <>
      {/* Apprehension Explanation Modal */}
      <ApprehensionExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        onSave={handleModalSave}
      />

      <div className="relative w-full flex justify-center min-h-screen items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:pt-8 lg:pt-8">
        <div className="relative z-10 w-full max-w-full bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex justify-center mb-4 w-[550px] lg:w-full max-w-full">
            <div className="bg-white rounded-lg shadow-md px-4 sm:px-6 md:px-10 py-6 max-h-[700px] lg:max-w-6xl lg:mt-6 overflow-auto">
              <Typography className="text-2xl text-center font-bold text-sky-800 mb-6">
                FEEDBACK FORM
              </Typography>

              {/* Likert Legend */}
              <div className="text-sm text-gray-700 mb-6">
                <strong className="text-red-600">
                  Rating Scale (Likert Scale):
                </strong>
                <ul className="list-disc ml-5">
                  <li>
                    <span className="text-blue-600">5</span> – Excellent
                    (Napakahusay)
                  </li>
                  <li>
                    <span className="text-blue-600">4</span> – Very Good
                    (Magaling)
                  </li>
                  <li>
                    <span className="text-blue-600">3</span> – Satisfactory
                    (Katanggap-tanggap)
                  </li>
                  <li>
                    <span className="text-blue-600">2</span> – Needs Improvement
                    (Kailangan ng Pagpapabuti)
                  </li>
                  <li>
                    <span className="text-blue-600">1</span> – Poor (Mahina)
                  </li>
                </ul>
              </div>

              {/* Apprehension question */}
              <div className="text-center mb-6">
                <p className="font-medium text-md mb-2">
                  Did the apprehension officer accurately apprehend you?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={`${userSelection === true ? "bg-blue-500 text-white" : ""}`}
                    onClick={handleYesClick}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`${userSelection === false ? "bg-blue-500 text-white" : ""}`}
                    onClick={handleNoClick}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {questions.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-6">
                    <p className="text-red-600 font-bold mb-3">
                      {group.category}
                    </p>
                    {group.items.map((text, idx) => {
                      const qNum = groupIndex * 3 + idx + 1;
                      return (
                        <div key={qNum} className="mb-6 w-full">
                          <div className="grid grid-cols-[1fr_repeat(5,40px)] items-start gap-x-4">
                            <div></div>
                            {[1, 2, 3, 4, 5].map((opt) => (
                              <div
                                key={`top-label-${qNum}-${opt}`}
                                className="text-xs text-center text-gray-600 font-medium"
                              >
                                {opt}
                              </div>
                            ))}
                            <p className="text-sm text-gray-800 font-medium col-span-1">
                              {qNum}. {text}
                            </p>
                            {[1, 2, 3, 4, 5].map((opt) => (
                              <label
                                key={`radio-${qNum}-${opt}`}
                                className="flex justify-center items-center"
                              >
                                <input
                                  type="radio"
                                  value={opt}
                                  {...register(`q${qNum}` as keyof T_Feedback, {
                                    required: true,
                                  })}
                                  className="w-5 h-5"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Comments */}
                <div className="mb-6">
                  <label className="block font-medium text-gray-800 mb-1">
                    Comments/Suggestions:
                  </label>
                  <textarea
                    {...register("comments")}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md p-2 resize-none"
                    placeholder="Write your comments here..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-32 bg-sky-600 hover:bg-sky-700 text-white font-semibold"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
