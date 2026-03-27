const EMOJI_KEYWORDS: [string[], string][] = [
  [["run", "running", "jog", "jogging", "sprint"], "🏃"],
  [["walk", "walking", "steps", "step"], "🚶"],
  [["gym", "workout", "exercise", "lift", "lifting", "weights", "strength"], "💪"],
  [["swim", "swimming", "pool"], "🏊"],
  [["bike", "cycling", "cycle", "bicycle"], "🚴"],
  [["hike", "hiking", "trail"], "🥾"],
  [["yoga"], "🧘"],
  [["meditate", "meditation", "mindfulness", "breathe", "breathing"], "🧘"],
  [["stretch", "stretching", "flexibility"], "🤸"],
  [["pushup", "push-up", "push up", "situp", "sit-up", "sit up", "pullup", "pull-up"], "💪"],
  [["read", "reading", "book", "books"], "📚"],
  [["write", "writing", "journal", "journaling", "diary"], "✍️"],
  [["study", "studying", "learn", "learning", "course", "class"], "📖"],
  [["code", "coding", "program", "programming", "develop"], "💻"],
  [["draw", "drawing", "art", "paint", "painting", "sketch"], "🎨"],
  [["music", "guitar", "piano", "sing", "singing", "practice instrument"], "🎵"],
  [["water", "hydrate", "hydration", "drink water"], "💧"],
  [["sleep", "rest", "bed", "bedtime", "nap"], "😴"],
  [["cook", "cooking", "meal", "meal prep"], "🍳"],
  [["eat", "eating", "diet", "nutrition", "food"], "🥗"],
  [["vegetable", "veggies", "veggie", "greens", "salad"], "🥦"],
  [["fruit", "fruits"], "🍎"],
  [["protein", "meat"], "🥩"],
  [["coffee"], "☕"],
  [["tea"], "🍵"],
  [["vitamins", "vitamin", "supplements", "supplement", "pills"], "💊"],
  [["floss", "flossing", "teeth", "brush teeth", "dental"], "🪥"],
  [["cold shower", "shower"], "🚿"],
  [["gratitude", "grateful", "thankful", "thankfulness"], "🙏"],
  [["pray", "prayer"], "🙏"],
  [["sunlight", "outside", "sun", "outdoors"], "☀️"],
  [["saving", "savings", "money", "budget", "finance"], "💰"],
  [["no alcohol", "alcohol", "sober", "no drinking"], "🍺"],
  [["no sugar", "sugar", "sweets", "no junk"], "🍬"],
  [["fast", "fasting", "intermittent fasting"], "⏱️"],
  [["clean", "cleaning", "tidy", "declutter"], "🧹"],
  [["posture"], "🪑"],
  [["phone", "screen time", "no phone"], "📱"],
  [["social media", "no social media"], "📵"],
];

export function suggestEmoji(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [keywords, emoji] of EMOJI_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return emoji;
    }
  }
  return null;
}
