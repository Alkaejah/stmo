import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";
import { APP_NAME } from "@repo/constants";
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from "../constants/ev";

export type TSendEmailParams = {
  to: string[];
  template: string;
  subject: string;
  sender?: string;
};

export class EmailService {
  private sesProviderClient: SESClient;
  private config: SESClientConfig;
  private AWS_REGION: string;
  private AWS_ACCESS_KEY: string;
  private AWS_SECRET_ACCESS_KEY: string;
  private DEFAULT_SENDER: string;

  constructor() {
    this.AWS_REGION = AWS_REGION || "";
    this.AWS_ACCESS_KEY = AWS_ACCESS_KEY || "";
    this.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY || "";
    this.DEFAULT_SENDER = `"${APP_NAME}" <no-reply@etravio.org>`;

    this.config = {
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
    };

    this.sesProviderClient = new SESClient(this.config);
  }

  async sendEmail(sendEmailParams: TSendEmailParams) {
    const { to, template, subject, sender } = sendEmailParams;
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: template,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: sender ?? this.DEFAULT_SENDER,
    };

    const command = new SendEmailCommand(params);
    return await this.sesProviderClient.send(command);
  }
}
