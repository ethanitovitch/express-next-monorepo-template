type PageProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Page({ title, subtitle, children }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </header>

      <section>
        {children}
      </section>
    </div>
  )
}