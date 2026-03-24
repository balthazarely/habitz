const now = new Date();

export const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
export const todayShort = now.toLocaleDateString("en-US", { weekday: "short" });
