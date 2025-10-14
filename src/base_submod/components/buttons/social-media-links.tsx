import { Link } from 'react-router-dom'
import { SOCIAL_MEDIA_ROUTES } from '@/base_submod/data/routing/social-media-routes'

interface SocialMediaLinkProps {
  to: string
  icon: string
  alt: string
}

function SocialMediaLink({ to, icon, alt }: SocialMediaLinkProps) {
  return (
    <Link to={to} target="_blank" rel="noreferrer">
      <img src={icon} alt={alt} className=":uno: cursor-pointer text-2xl text-white hover:text-orange-light" />
    </Link>
  )
}

function SocialMediaLinks() {
  return (
    <div className=":uno: flex justify-center lg:justify-start space-x-4">
      {Object.values(SOCIAL_MEDIA_ROUTES).map(route => (
        <SocialMediaLink key={route.title} to={route.href} icon={route.icon} alt={route.title} />
      ))}
    </div>
  )
}

export default SocialMediaLinks
