import { Server } from "./framework";
import { App } from "@console/core/app";
import { AWS } from "@console/core/aws";
import { z } from "zod";

export const server = new Server().mutation(
  "connect",
  {
    app: z.string(),
    aws_account_id: z.string(),
    stage: z.string(),
  },
  async (input) => {
    let appID = await App.fromName(input.app).then((x) => x?.id);
    if (!appID) appID = await App.create({ name: input.app });

    let awsID = await AWS.Account.fromAccountID(input.aws_account_id).then(
      (x) => x?.id
    );

    if (!awsID)
      awsID = await AWS.Account.create({
        accountID: input.aws_account_id,
      });

    await App.connectStage({
      appID,
      name: input.stage,
      awsAccountID: awsID,
    });
  }
);

export type ServerType = typeof server;
