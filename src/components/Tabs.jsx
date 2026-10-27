import SegmentedControl from "./ui/SegmentedControl";
const options = [
  { id: "LOGIN", label: "Connexion" },
  { id: "SIGNUP_PHARMACIEN", label: "Pharmacien" },
  { id: "SIGNUP_RESIDENCE", label: "Résidence" },
];
export default function Tabs({ activeMode, setActiveMode }) {
  return (
    <SegmentedControl
      options={options}
      value={activeMode}
      onChange={setActiveMode}
      label="Type de connexion"
    />
  );
}
