// export const getStoredUserName = (): string | null => {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   // 1️⃣ Direct flat keys (old support)
//   const tryValue = (...keys: string[]) => {
//     for (const key of keys) {
//       const value = localStorage.getItem(key);
//       if (value && value !== "undefined" && value !== "null") {
//         return value;
//       }
//     }
//     return null;
//   };

//   const direct = tryValue("user_name", "username", "agent_id");
//   if (direct) {
//     return direct;
//   }

//   // 2️⃣ New nested structure
//   const olivData = localStorage.getItem("olivData");
//   if (!olivData) {
//     return "dev14";
//   }

//   try {
//     const parsed = JSON.parse(olivData);

//     if (parsed && typeof parsed === "object") {
//       // ✅ NEW: candidate.username priority
//       if (parsed.candidate?.username) {
//         return parsed.candidate.username;
//       }

//       // fallback (old structure support)
//       return (
//         parsed.user_name ||
//         parsed.agent_id ||
//         parsed.handle ||
//         parsed.username ||
//         ""
//       );
//     }
//   } catch (error) {
//     console.error("Invalid olivData JSON", error);
//   }

//   return "";
// };



// Updated

export type OlivData = {
  id?: string;
  username?: string;
  user_name?: string;
  agent_id?: string;
  handle?: string;
  fullName?: string;
  oliv_id?: string;
  candidate?: {
    id?: string;
    username?: string;
    email?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export const getStoredOlivData = (): OlivData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("olivData");
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as OlivData;
    }
  } catch (error) {
    console.error("Invalid olivData JSON", error);
  }

  return null;
};

export const getStoredUserName = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // 1️⃣ Direct flat localStorage keys (legacy support)
  const tryValue = (...keys: string[]) => {
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value && value !== "undefined" && value !== "null") {
        return value;
      }
    }
    return null;
  };

  const direct = tryValue("user_name", "username", "agent_id", "fullName");
  if (direct) {
    return direct;
  }

  // 2️⃣ olivData (direct object)
  const parsed = getStoredOlivData();
  if (!parsed) {
    return null;
  }

  return (
    parsed.username ||

    // fallback
    parsed.fullName ||

    // legacy
    parsed.user_name ||
    parsed.agent_id ||
    parsed.handle ||
    null
  );
};

export const getStoredOlivId = (): string | null => {
  const parsed = getStoredOlivData();
  if (!parsed) {
    return null;
  }

  return (
    parsed.id ||
    parsed.oliv_id ||
    parsed.candidate?.id ||
    parsed.user_id ||
    parsed.userId ||
    null
  );
};
