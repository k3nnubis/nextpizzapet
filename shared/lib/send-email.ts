import { render } from "@react-email/render";
import type { ReactElement } from "react";


  // Previous Resend implementation. Kept temporarily for an easy rollback.
 
  import { Resend } from "resend";
  import React from "react";
 
  export const sendEmail = async (to: string, subject: string, template: React.ReactNode) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        react: template,
      });
 
      if (error) {
        throw new Error(error.message);
      }
 
      return data;
    } catch (error) {
      console.error("Send email error:", error);
      throw error;
    }
  };
 

// interface RuSenderResponse {
//   uuid: string;
// }

// export const sendEmail = async (to: string, subject: string, template: ReactElement) => {
//   const apiKey = process.env.RUSENDER_API_KEY;
//   const sendingKeyId = process.env.RUSENDER_KEY_ID;
//   const fromEmail = process.env.RUSENDER_FROM_EMAIL;

//   if (!apiKey || !sendingKeyId || !fromEmail) {
//     throw new Error(
//       "RuSender is not configured. Set RUSENDER_API_KEY, RUSENDER_KEY_ID and RUSENDER_FROM_EMAIL.",
//     );
//   }

//   try {
//     const html = await render(template);
//     const response = await fetch(
//       `https://api.rusender.ru/api/v1/external-mails/send/${encodeURIComponent(sendingKeyId)}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mail: {
//             to: { email: to },
//             from: { email: fromEmail },
//             subject,
//             html,
//           },
//         }),
//       },
//     );

//     if (!response.ok) {
//       const errorBody = await response.text();
//       throw new Error(`RuSender error ${response.status}: ${errorBody}`);
//     }

//     return (await response.json()) as RuSenderResponse;
//   } catch (error) {
//     console.error("Send email error:", error);
//     throw error;
//   }
// };
