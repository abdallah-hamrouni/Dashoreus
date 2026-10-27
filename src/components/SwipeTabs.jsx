import SegmentedControl from "./ui/SegmentedControl";
const options = [
  { id: "LOGIN", label: "Connexion", icon: "lock" },
  { id: "ACTIVATION", label: "Activer mon compte", icon: "user" },
];
export default function SwipeTabs({
  activeMode,
  setActiveMode,
  disabled = false,
}) {
  return (
    <SegmentedControl
      options={options}
      value={activeMode}
      onChange={setActiveMode}
      label="Accès à votre espace"
      disabled={disabled}
    />
  );
}
