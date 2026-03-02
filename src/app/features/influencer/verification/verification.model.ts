export interface VerificationRequestPayload {
  channelUrl: string;
}

export interface VerificationRequestResponse {
  expirationDateAt: string;
  message: string | null;
  verificationToken: string;
}

export interface VerificationConfirmResponse {
  expirationDateAt: string;
  message: string | null;
  verificationToken: string;
}

export interface VerificationResponse {
  verificationToken: string;
  expirationDateAt: string;
}