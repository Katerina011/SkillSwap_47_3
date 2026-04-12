export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ExchangeRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExchangeRequestDTO {
  fromUserId: string;
  toUserId: string;
  skillId: string;
}

export interface ExchangeRequestWithUser extends ExchangeRequest {
  fromUserName?: string;
  toUserName?: string;
  skillName?: string;
}