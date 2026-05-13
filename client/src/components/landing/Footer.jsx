const Footer = () => {
  return (
    <footer className="border-t border-brand-border/70 bg-brand-sidebar/90 py-10 text-center text-sm text-brand-subtext backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-brand-text/85">
          © {new Date().getFullYear()} FreelanceHub. All rights reserved.
        </p>
        <p className="mt-3 text-xs text-brand-subtext">
          Premium freelance marketplace built for clients and freelancers who want more polish, better matches, and faster outcomes.
        </p>
      </div>
    </footer>
  )
}

export default Footer
