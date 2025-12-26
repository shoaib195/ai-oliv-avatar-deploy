import { checkAgentByOlivId } from "@/lib/api/avatarApi";
import { getStoredOlivId, getStoredUserName } from "@/lib/utils/userStorage";

export interface AgentIdentity {
  exists: boolean;
  userName: string | null;
}

const buildFallbackIdentity = (): AgentIdentity => {
  const fallbackUserName = getStoredUserName();
  return {
    exists: Boolean(fallbackUserName),
    userName: fallbackUserName,
  };
};

export const fetchAgentIdentity = async (): Promise<AgentIdentity> => {
  const olivId = getStoredOlivId();
  if (!olivId) {
    return buildFallbackIdentity();
  }

  try {
    const response = await checkAgentByOlivId(olivId);
    const data = response.data?.data;
    if (data?.user_name) {
      return {
        exists: Boolean(data.exists),
        userName: data.user_name,
      };
    }

    return buildFallbackIdentity();
  } catch (error) {
    console.error("Failed to resolve agent identity", error);
    return buildFallbackIdentity();
  }
};
