import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION ?? "eu-west-1",
});

export async function notifyFirstVote(
  to: string,
  pollTitle: string,
  manageUrl: string,
): Promise<void> {
  const from = process.env.SES_FROM_EMAIL;
  if (!from) return;

  await ses.send(
    new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: `Premier vote sur « ${pollTitle} »` },
        Body: {
          Text: {
            Data: `Votre sondage « ${pollTitle} » a reçu son premier vote.\nGérer : ${manageUrl}`,
          },
        },
      },
    }),
  );
}
