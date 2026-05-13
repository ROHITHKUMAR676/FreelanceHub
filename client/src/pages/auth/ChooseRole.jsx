import RoleSelector from '../../components/auth/RoleSelector'
import { useNavigate } from 'react-router-dom'

function ChooseRole() {
  const navigate = useNavigate()

  return (
    <div className="premium-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="premium-card w-full max-w-3xl p-6 md:p-8">
        <RoleSelector onSelect={(role) => navigate(`/register?role=${role}`)} />
      </div>
    </div>
  )
}

export default ChooseRole
