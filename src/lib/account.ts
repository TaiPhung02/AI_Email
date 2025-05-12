import type {
  EmailAddress,
  EmailMessage,
  SyncResponse,
  SyncUpdatedResponse,
} from "@/types";
import axios from "axios";

const API_BASE_URL = "https://api.aurinko.io/v1";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync() {
    const response = await axios.post<SyncResponse>(
      `${API_BASE_URL}/email/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );

    return response.data;
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    let params: Record<string, string> = {};
    if (deltaToken) {
      params.deltaToken = deltaToken;
    }
    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await axios.get<SyncUpdatedResponse>(
      `${API_BASE_URL}/email/sync/updated`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );

    return response.data;
  }

  async performInitialSync() {
    try {
      // start the sync process
      let syncResponse = await this.startSync();
      while (!syncResponse.ready) {
        // wait for the sync to be ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      // get the bookmark delta token
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        // sync has completed
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      // fetch all pages if there are more
      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });

        allEmails = allEmails.concat(updatedResponse.records);

        if (updatedResponse.nextDeltaToken) {
          // sync has ended
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log(
        "initial sync completed, we have synced",
        allEmails.length,
        "emails",
      );

      // store the latest delta token for future incremental syncs

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error during initial sync:", error.response?.data);
      } else {
        console.error("Error during initial sync:", error);
      }
    }
  }

  async sendEmail({
    from,
    subject,
    body,
    inReplyTo,
    references,
    threadId,
    to,
    cc,
    bcc,
    replyTo,
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    references?: string;
    threadId?: string;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress;
  }) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/email/messages`,
        {
          from,
          subject,
          body,
          inReplyTo,
          references,
          threadId,
          to,
          cc,
          bcc,
          replyTo: [replyTo],
        },
        {
          params: {
            returnIds: true,
          },
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      console.log("sendmail", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending email:",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error sending email:", error);
      }
      throw error;
    }
  }
}
