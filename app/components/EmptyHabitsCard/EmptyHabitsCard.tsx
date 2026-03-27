export default function EmptyHabitsCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-card border border-border rounded-xl p-8 text-center">
      <span className="text-3xl">🌱</span>
      <p className="font-medium text-foreground">No habits yet</p>
      <p className="text-sm text-muted-foreground">
        Create your first habit to get started.
      </p>
    </div>
  );
}
