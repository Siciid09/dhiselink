"use server";

export async function completeOtherOnboarding(formData: FormData) {
  try {
    // Convert formData into a plain object for logging or DB use
    const data = Object.fromEntries(formData);

    // Example: save to DB or handle logic (placeholder for now)
    console.log("Other onboarding submitted:", data);

    // ✅ Always return something predictable
    return { success: true, message: "Onboarding completed successfully." };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, message: "Something went wrong." };
  }
}
