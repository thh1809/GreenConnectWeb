export default function Page() {
  return (
    <div className="bg-black text-white">
      <div className="bg-background text-foreground p-6 rounded-lg">
        <h1 className="text-primary">Hello Tailwind</h1>
        <p className="text-primary-foreground">
          This text uses primary foreground color
        </p>
        <div className="bg-card text-card-foreground p-4 rounded-md mt-4">
          Card content
        </div>
        <div className="bg-gradient-primary p-4 rounded-lg mt-4 text-white">
          Gradient Primary
        </div>
      </div>
    </div>
  );
}
