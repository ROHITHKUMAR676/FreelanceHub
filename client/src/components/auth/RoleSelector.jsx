const roles = [
    {
      key: 'client',
      title: 'Client',
      description: 'Post projects and hire skilled freelancers to complete your work.',
      accent: 'from-brand-primary to-sky-400',
    },
    {
      key: 'freelancer',
      title: 'Freelancer',
      description: 'Browse projects, submit proposals, and earn by completing tasks.',
      accent: 'from-brand-secondary to-emerald-400',
    },
  ]
  
  const RoleSelector = ({ onSelect }) => {
    return (
      <div className="animate-fade-up">
        <h1 className="text-center text-2xl font-bold tracking-tight text-brand-text md:text-3xl">
          Choose Your Role
        </h1>
  
        <p className="mt-2 text-center text-brand-subtext">
          Select how you want to use the platform
        </p>
  
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 stagger-in">
          {roles.map((role) => (
            <div
              key={role.key}
              onClick={() => onSelect(role.key)}
              className="premium-card group cursor-pointer p-6"
            >
              <div className={`mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br ${role.accent} shadow-glow transition duration-300 group-hover:scale-110 group-hover:rotate-3`} />
              <h2 className="text-lg font-semibold text-brand-text">
                {role.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-subtext">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default RoleSelector
