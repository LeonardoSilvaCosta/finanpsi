import Form from "@/components/Form"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            FinanPsi
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Diagnóstico financeiro e curso online prático para psicólogos e profissionais da saúde
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize seu dinheiro de forma rápida, supere bloqueios emocionais ligados às finanças e invista no seu crescimento profissional
          </p>
        </section>

        {/* Form Section */}
        <section className="max-w-2xl mx-auto">
          <Form />
        </section>
      </div>
    </main>
  )
}

