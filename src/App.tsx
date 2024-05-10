import { Calendar } from "./components/Calendar";
import { EventsProvider } from "./context/Events";
import "./style.css";

export default function App() {
  return (
    <EventsProvider>
      <Calendar />
    // </EventsProvider>
  );
}
