import { CreateExchangeRequestDTO, ExchangeRequest } from "../model/types";

const REQUESTS_STORAGE_KEY = 'exchange_requests';

function readRequestsFromStorage(): ExchangeRequest[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ExchangeRequest[];
  } catch {
    localStorage.removeItem(REQUESTS_STORAGE_KEY);
    return [];
  }
}

function writeRequestsToStorage(requests: ExchangeRequest[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

export function createExchangeRequest(dto: CreateExchangeRequestDTO): ExchangeRequest {
  const requests = readRequestsFromStorage();

  const newRequest: ExchangeRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    fromUserId: dto.fromUserId,
    toUserId: dto.toUserId,
    skillId: dto.skillId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  requests.push(newRequest);
  writeRequestsToStorage(requests);

  return newRequest;
}

export function getRequestsByUser(userId: string): ExchangeRequest[] {
  const requests = readRequestsFromStorage();
  return requests.filter((req) => req.fromUserId === userId || req.toUserId === userId);
}

export function getRequestBySkillAndUsers(
  skillId: string,
  fromUserId: string,
  toUserId: string,
): ExchangeRequest | undefined {
  const requests = readRequestsFromStorage();
  return requests.find(
    (req) =>
      req.skillId === skillId &&
      req.fromUserId === fromUserId &&
      req.toUserId === toUserId,
  );
}

export function hasActiveRequest(
  skillId: string,
  fromUserId: string,
  toUserId: string,
): boolean {
  const request = getRequestBySkillAndUsers(skillId, fromUserId, toUserId);
  return request?.status === 'pending';
}