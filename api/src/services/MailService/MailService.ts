import nodemailer, { Transporter } from "nodemailer";
import { mailConfig } from "./emailConfig/emailConfig";
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  public async sendMail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {

    const sender = {
      email: "hello@example.com",
      name: "Mailtrap Test",
    };
    const recipients = [
      {
        email: "charguinadar@gmail.com",
      }
    ];


    try {
      await this.transporter.sendMail({
        from: mailConfig.auth.user,
        //from: `"Me" <${mailConfig.auth.user}>`, // sender: your Gmail
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }
}
