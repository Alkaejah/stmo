import { NOT_AUTHORIZED, UNKNOWN_ERROR_OCCURRED } from "@/common/constants";
import { ResponseService } from "@/common/services/response";
import dbFeedbacks from "@/models/dbFeedbacks";
import dbBackOfficers from "@/models/dbBackOfficers";
import { T_Feedback } from "@repo/contract";
import { Request, Response } from "express";

const response = new ResponseService();

// export const addFeedback = async (req: Request, res: Response) => {
//   const isDriver = res.locals.driver?.isDriver;
//   const driverId = res.locals.driver?.id;
//   const enforcerId = req.params.enforcerId;

//   if (!isDriver || !driverId) {
//     return res.json(response.error({ message: NOT_AUTHORIZED }));
//   }

//   const {
//     whyApprehensionIsInAccurate,
//     isAccuratelyApprehended,
//     q1,
//     q2,
//     q3,
//     q4,
//     q5,
//     q6,
//     q7,
//     q8,
//     q9,
//     q10,
//     q11,
//     comments,
//   }: T_Feedback = req.body;

//   try {
//     // Step 1: Create the feedback
//     const newFeedback = await dbFeedbacks.create({
//       whyApprehensionIsInAccurate,
//       isAccuratelyApprehended,
//       q1,
//       q2,
//       q3,
//       q4,
//       q5,
//       q6,
//       q7,
//       q8,
//       q9,
//       q10,
//       q11,
//       comments,
//     });

//     // Step 2: Push feedback _id to the enforcer's feedbacks array
//     await dbBackOfficers.findByIdAndUpdate(
//       enforcerId,
//       {
//         $push: { feedbacks: newFeedback._id },
//         updatedAt: new Date(),
//       },
//       { new: true },
//     );

//     res.json(
//       response.success({
//         item: newFeedback,
//       }),
//     );
//   } catch (err: any) {
//     return res.json(
//       response.error({
//         message: err.message || UNKNOWN_ERROR_OCCURRED,
//       }),
//     );
//   }
// };

export const addFeedback = async (req: Request, res: Response) => {
  const isDriver = res.locals.driver?.isDriver;
  const driverId = res.locals.driver?.id;
  const enforcerId = req.params.enforcerId;

  if (!isDriver || !driverId) {
    return res.json(response.error({ message: NOT_AUTHORIZED }));
  }

  const {
    whyApprehensionIsInAccurate,
    isAccuratelyApprehended,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    q11,
    comments,
  }: T_Feedback = req.body;

  try {
    // Step 1: Find the enforcer to get their current assignment
    const enforcer = await dbBackOfficers.findById(enforcerId).lean();
    if (!enforcer || !enforcer.assignment?.length) {
      return res.json(
        response.error({ message: "Enforcer has no current assignment." }),
      );
    }

    // Step 2: Get the latest assignment (last in array)
    const currentAssignmentId =
      enforcer.assignment[enforcer.assignment.length - 1];

    // Step 3: Create the feedback with address
    const newFeedback = await dbFeedbacks.create({
      whyApprehensionIsInAccurate,
      isAccuratelyApprehended,
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
      q8,
      q9,
      q10,
      q11,
      comments,
      address: currentAssignmentId, // ← added address here
    });

    // Step 4: Push feedback _id to the enforcer's feedbacks array
    await dbBackOfficers.findByIdAndUpdate(
      enforcerId,
      {
        $push: { feedbacks: newFeedback._id },
        updatedAt: new Date(),
      },
      { new: true },
    );

    res.json(
      response.success({
        item: newFeedback,
      }),
    );
  } catch (err: any) {
    return res.json(
      response.error({
        message: err.message || UNKNOWN_ERROR_OCCURRED,
      }),
    );
  }
};
