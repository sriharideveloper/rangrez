export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-04-04";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const useCdn = false;

function assertValue(v, errorMessage) {
  if (v === undefined) {
    // throw new Error(errorMessage)
    // Avoid tossing errors in dev if variables are empty during setup
    console.warn(errorMessage);
    return "default-id";
  }
  return v;
}
