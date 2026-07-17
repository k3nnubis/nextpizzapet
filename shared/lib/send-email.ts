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
