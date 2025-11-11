import { useMemo, useState } from "react";
import { Typography } from "@/common/components/ui/Typography";
import useGetAllReceivedFeedbacksByEnforcerId from "@/common/hooks/Admin/useGetAllReceivedFeedbacksByEnforcerId";
import { T_Feedback } from "@repo/contract";
import { useParams } from "next/navigation";

const questions = [
  {
    section: "I. Professionalism and Conduct",
    tagalog: "Pagiging Propesyonal at Asal",
    items: ["q1", "q2", "q3"],
  },
  {
    section: "II. Knowledge and Competence",
    tagalog: "Kaalaman at kasanayan",
    items: ["q4", "q5", "q6"],
  },
  {
    section: "III. Apprehension and Citation Issuance Skills",
    tagalog: "Kasanayan sa Pag-aresto at Pagpapatupad ng Batas",
    items: ["q7", "q8", "q9"],
  },
  {
    section: "IV. Communication and Reporting",
    tagalog: "Komunikasyon at Pagsumite ng Ulat",
    items: ["q10", "q11"],
  },
];

const descriptions: Record<string, { text: string; translation: string }> = {
  q1: {
    text: "Q1: Consistently upholds ethical standards by issuing citation tickets fairly, without bias or favoritism.",
    translation:
      "Palaging nagpapakita ng integridad sa pagbibigay ng citation ticket nang patas at walang kinikilingan.",
  },
  q2: {
    text: "Q2: Handles interactions with violators calmly and respectfully, even in challenging situations.",
    translation:
      "Maayos at magalang na nakikitungo sa mga lumalabag kahit sa mahihirap na sitwasyon.",
  },
  q3: {
    text: "Q3: Strictly follows municipal guidelines in issuing citation tickets, ensuring compliance with legal and procedural standards.",
    translation:
      "Mahigpit na sumusunod sa mga alituntunin ng munisipalidad sa pagbibigay ng citation ticket para matiyak ang pagsunod sa batas.",
  },
  q4: {
    text: "Q4: Demonstrates a strong understanding of traffic rules, local ordinances, and relevant regulations specific to the municipality.",
    translation:
      "Nagpapakita ng malalim na kaalaman sa batas-trapiko, lokal na ordinansa, at iba pang regulasyon sa munisipalidad.",
  },
  q5: {
    text: "Q5: Assesses situations accurately and makes appropriate decisions when determining violations and issuing citation tickets.",
    translation:
      "Wasto at maingat na sinusuri ang mga sitwasyon at gumagawa ng tamang desisyon sa pag-isyu ng citation ticket.",
  },
  q6: {
    text: "Q6: Approaches violators with confidence and ensures efficient issuance of citation tickets to maintain order and compliance.",
    translation:
      "May kumpiyansa at kahusayan sa pagharap sa mga lumalabag upang mapanatili ang kaayusan at pagsunod sa batas.",
  },
  q7: {
    text: "Q7: Proactively monitors traffic and public areas, promptly identifying violators and issuing citation tickets when necessary.",
    translation:
      "Aktibong nagmamasid sa trapiko at pampublikong lugar, agad na kinikilala ang mga lumalabag at nag-isyu ng citation ticket kung kinakailangan.",
  },
  q8: {
    text: "Q8: Ensures that all citation tickets are issued with correct details, including the violation, location, and time, minimizing errors.",
    translation:
      "Tinitiyak na ang lahat ng citation ticket ay tama ang detalye, kabilang ang paglabag, lokasyon, at oras, upang maiwasan ang pagkakamali.",
  },
  q9: {
    text: "Q9: Maintains a safe environment while issuing citation tickets by minimizing confrontation and ensuring compliance from violators.",
    translation:
      "Tinitiyak ang kaligtasan sa panahon ng pag-aprehend at pag-isyu ng citation ticket sa pamamagitan ng pag-iwas sa sitwasyon at pagtiyak sa pagsunod ng lumalabag.",
  },
  q10: {
    text: "Q10: Explains violations clearly and professionally, ensuring that violators understand the reason for the citation.",
    translation:
      "Malinaw at propesyonal na ipinapaliwanag sa lumalabag ang dahilan ng citation ticket upang maiwasan ang hindi pagkakaunawaan.",
  },
  q11: {
    text: "Q11: Addresses public inquiries about citation procedures and violations with clarity and patience.",
    translation:
      "Agad at tumpak na tumutugon sa mga katanungan ng publiko tungkol sa proseso ng citation ticket at mga paglabag nang may linaw at tiyaga.",
  },
};

const ReceivedFeedbacks = () => {
  const params = useParams<{ enforcerId: string }>();
  const enforcerId = params.enforcerId;
  const { data } = useGetAllReceivedFeedbacksByEnforcerId(enforcerId);

  const feedbackList: T_Feedback[] = data?.item?.feedbacks || [];

  const addressOptions = [
    "All Assignments",
    ...new Set(
      feedbackList
        .filter(
          (f) => f.address?.street?.street && f.address?.barangay?.barangay,
        )
        .map(
          (f) => `${f.address?.street.street}, ${f.address?.barangay.barangay}`,
        ),
    ),
  ];

  const [selectedAddress, setSelectedAddress] = useState("All Assignments");

  const filteredFeedbacks =
    selectedAddress === "All Assignments"
      ? feedbackList
      : feedbackList.filter(
          (f) =>
            `${f.address?.street?.street}, ${f.address?.barangay?.barangay}` ===
            selectedAddress,
        );

  const ratingMap = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};

    for (let i = 1; i <= 11; i++) {
      map[`q${i}`] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    filteredFeedbacks.forEach((fb) => {
      for (let i = 1; i <= 11; i++) {
        const key = `q${i}` as keyof T_Feedback;
        const value = fb[key];
        if (typeof value === "number" && map[key]) {
          map[key][value] = (map[key][value] || 0) + 1;
        }
      }
    });

    return map;
  }, [filteredFeedbacks]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-10 md:p-10 w-full lg:max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h2" fontWeight="bold" className="text-gray-800">
          OFFICERS EVALUATION{" "}
          <span className="font-bold">
            | {data?.item?.firstName} {data?.item?.lastName}
          </span>
        </Typography>

        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          {addressOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Likert Scale */}
      <div className="text-gray-800 mb-1 space-y-1">
        <Typography fontWeight="semiBold" className="text-red-600 text-left">
          Rating Scale (Likert Scale):
        </Typography>
        <ul className="list-disc pl-5 space-y-0.5 text-sm text-left">
          <li>
            <Typography className="inline">
              <span className="font-bold">5</span> - Excellent{" "}
              <span className="italic">(Napakahusay)</span>
            </Typography>
          </li>
          <li>
            <Typography className="inline">
              <span className="font-bold">4</span> - Very Good{" "}
              <span className="italic">(Magaling)</span>
            </Typography>
          </li>
          <li>
            <Typography className="inline">
              <span className="font-bold">3</span> - Satisfactory{" "}
              <span className="italic">(Katanggap-tanggap)</span>
            </Typography>
          </li>
          <li>
            <Typography className="inline">
              <span className="font-bold">2</span> - Needs Improvement{" "}
              <span className="italic">(Kailangan ng Pagpapabuti)</span>
            </Typography>
          </li>
          <li>
            <Typography className="inline">
              <span className="font-bold">1</span> - Poor{" "}
              <span className="italic">(Mahina)</span>
            </Typography>
          </li>
        </ul>

        <Typography
          className="mt-3 text-gray-700 italic text-left"
          fontWeight="semiBold"
        >
          The table shows the total number of responses received for each
          question, categorized by rating (1 to 5), based on feedback submitted
          by violators.
        </Typography>
      </div>

      {/* Ratings Table */}
      {questions.map((section, idx) => (
        <table key={idx} className="w-full border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 font-bold border-r border-gray-300 w-[80%]">
                <Typography variant="p" fontWeight="bold">
                  {section.section}{" "}
                  <span className="italic font-normal text-gray-700">
                    ({section.tagalog})
                  </span>
                </Typography>
              </th>
              {[1, 2, 3, 4, 5].map((val) => (
                <th
                  key={val}
                  className="px-2 py-2 font-semibold border-l border-gray-300 w-12"
                >
                  {val}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.items.map((qKey, qIdx) => (
              <tr
                key={qIdx}
                className="border-t border-gray-300 align-top text-left"
              >
                <td className="px-4 py-3">
                  <Typography variant="p">
                    {descriptions[qKey]?.text ?? "—"}
                  </Typography>
                  <Typography className="italic text-gray-600">
                    {descriptions[qKey]?.translation ?? ""}
                  </Typography>
                </td>
                {[1, 2, 3, 4, 5].map((num) => (
                  <td
                    key={num}
                    className="text-center align-middle px-2 py-3 border-l border-gray-200"
                  >
                    {ratingMap[qKey]?.[num] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default ReceivedFeedbacks;
