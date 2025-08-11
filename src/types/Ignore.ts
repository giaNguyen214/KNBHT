
export type IgnoreImageContextType = {
  ignoredUsernames: (string | null)[];
  setIgnoredUsernames: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  ignoredMap: Map<string, Map<string, string>>;
  setIgnoredMap: React.Dispatch<React.SetStateAction<Map<string, Map<string, string>>>>;
}