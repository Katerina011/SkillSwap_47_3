// src/features/requests/hooks/useExchangeRequest.ts
import { useState, useCallback } from 'react';
import {
  createExchangeRequest,
  hasActiveRequest,
  getRequestBySkillAndUsers,
  getRequestsByUser, // ← добавить импорт
} from '../api/requestsApi';
import { ExchangeRequest } from '../model/types';

interface UseExchangeRequestReturn {
  createRequest: (
    fromUserId: string,
    toUserId: string,
    skillId: string,
  ) => ExchangeRequest | null;
  hasActiveRequestForSkill: (
    skillId: string,
    fromUserId: string,
    toUserId: string,
  ) => boolean;
  getUserRequests: (userId: string) => ExchangeRequest[]; // ← добавить
  isLoading: boolean;
  error: string | null;
}

export function useExchangeRequest(): UseExchangeRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(
    (
      fromUserId: string,
      toUserId: string,
      skillId: string,
    ): ExchangeRequest | null => {
      setIsLoading(true);
      setError(null);

      try {
        const existingRequest = getRequestBySkillAndUsers(
          skillId,
          fromUserId,
          toUserId,
        );
        if (existingRequest && existingRequest.status === 'pending') {
          setError('Заявка уже отправлена');
          return null;
        }

        const newRequest = createExchangeRequest({
          fromUserId,
          toUserId,
          skillId,
        });

        return newRequest;
      } catch (err) {
        setError('Не удалось создать заявку');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const hasActiveRequestForSkill = useCallback(
    (skillId: string, fromUserId: string, toUserId: string): boolean =>
      hasActiveRequest(skillId, fromUserId, toUserId),
    [],
  );

  const getUserRequests = useCallback(
    (userId: string): ExchangeRequest[] => getRequestsByUser(userId),
    [],
  );

  return {
    createRequest,
    hasActiveRequestForSkill,
    getUserRequests,
    isLoading,
    error,
  };
}
