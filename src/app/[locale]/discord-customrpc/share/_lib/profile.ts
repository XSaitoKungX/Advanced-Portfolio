export interface SharedProfile {
  name: string;
  applicationId: string;
  details?: string;
  state?: string;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  button1Label?: string;
  button1Url?: string;
  button2Label?: string;
  button2Url?: string;
}

export function decodeProfile(data: string): SharedProfile | null {
  try {
    const binary = atob(data);
    let json: string;
    try {
      json = new TextDecoder("utf-8", { fatal: true }).decode(
        Uint8Array.from(binary, (character) => character.charCodeAt(0)),
      );
    } catch {
      // Preserve links created with the older Latin-1/btoa encoding.
      json = binary;
    }
    const value: unknown = JSON.parse(json);
    if (!value || typeof value !== "object" || Array.isArray(value))
      return null;
    const fields = value as Record<string, unknown>;
    if (
      typeof fields.name !== "string" ||
      !fields.name.trim() ||
      typeof fields.applicationId !== "string" ||
      !fields.applicationId.trim()
    )
      return null;
    const profile: SharedProfile = {
      name: fields.name,
      applicationId: fields.applicationId,
    };
    const optionalFields = [
      "details",
      "state",
      "largeImageKey",
      "largeImageText",
      "smallImageKey",
      "smallImageText",
      "button1Label",
      "button1Url",
      "button2Label",
      "button2Url",
    ] as const;
    for (const field of optionalFields) {
      if (typeof fields[field] === "string") profile[field] = fields[field];
      else if (fields[field] != null) return null;
    }
    return profile;
  } catch {
    return null;
  }
}
