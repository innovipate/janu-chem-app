interface Props { children: React.ReactNode; className?: string }

export default function Layout({ children, className = '' }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-2xl mx-auto px-4 py-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}
