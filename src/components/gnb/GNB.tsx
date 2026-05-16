import GNBClient from "./GNBClient";

// Production GNB is a server component that conditionally hydrates client GNBClient
// with `autoFetch` on public pages. Stubbed to keep the same server→client shape
// without pulling in supabase auth / NotificationBell / BottomBar / Logo / useDarkMode.
export default function GNB() {
  return <GNBClient autoFetch />;
}
