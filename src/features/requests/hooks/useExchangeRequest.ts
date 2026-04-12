import { useState, useCallback } from 'react';
import {
  createExchangeRequest,
  hasActiveRequest,
  getRequestBySkillAndUsers,
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
  isLoading: boolean;
  error: string | null;
}

export function useExchangeRequest(): UseExchangeRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(
    (fromUserId: string, toUserId: string, skillId: string): ExchangeRequest | null => {
      setIsLoading(true);
      setError(null);

      try {
        const existingRequest = getRequestBySkillAndUsers(skillId, fromUserId, toUserId);
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

  return {
    createRequest,
    hasActiveRequestForSkill,
    isLoading,
    error,
  };
}