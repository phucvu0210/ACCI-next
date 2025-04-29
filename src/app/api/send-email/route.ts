import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import PDFDocument from 'pdfkit'


export async function POST(req: NextRequest) {
  const { email, content } = await req.json();

  if (!email || !content) {
    return NextResponse.json({ message: "Missing email content" }, { status: 400 });
  }

  try {
    const doc = new PDFDocument();
    
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "ACCI Registration Confirmation",
        text: "Heres your registration information.",
        attachments: [
          {
            filename: "registration.pdf",
            content: pdfBuffer,
          },
        ],
      });
    });

    doc.text(content);
    doc.end();

    return NextResponse.json({ message: "Email is sending" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}


