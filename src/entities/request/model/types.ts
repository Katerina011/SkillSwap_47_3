// src/entities/request/model/types.ts
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

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
