import { Link } from 'react-router-dom'
import FooterLogo from '@/assets/images/footer_logo.svg'
import { Separator } from '@/base_submod/components/ui/separator'
import { FooterLinksMain, FooterLinksSecondary } from '@/data/routing/site-links'
import SocialMediaLinks from '@/base_submod/components/buttons/social-media-links'
import PorterPhoneNumber from '@/base_submod/components/buttons/porter-phone-number'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className=":uno: bg-primary px-4 py-8 lg:px-6">
      <div className=":uno: mx-auto max-w-7xl">
        <div className=":uno: grid grid-cols-1 gap-8 lg:grid-cols-6">
          <div className=":uno: col-span-1 mx-auto lg:col-span-2 lg:mx-0">
            <div className=":uno: mb-4">
              <img src={FooterLogo} alt="Porter Logo" className=":uno: mx-auto max-w-[200px] lg:mx-0" />
            </div>
            <p className=":uno: mb-4 text-center text-balance text-sm text-white lg:text-start text-style-body-lg">
              <span className="text-orange-S-300">Need further assistance? </span>
              Call your dedicated Care Guide at
              {' '}
              <PorterPhoneNumber />
              {' '}
              and they will be happy to help!
            </p>
            <SocialMediaLinks />
          </div>
          {Object.entries(FooterLinksMain).map(([key, section]) => (
            <div key={key} className=":uno: col-span-1 mx-auto lg:mx-0">
              <h5 className=":uno: mb-2 text-center text-white uppercase font-bold lg:text-start">{section.title}</h5>
              <ul className=":uno: space-y-2">
                {section.links.map(link => (
                  <li key={link.href} className=":uno: text-center lg:text-start">
                    <Link to={link.href} className=":uno: font-montserrat text-white no-underline font-medium text-style-body-lg hover:text-orange-light">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className=":uno: my-8" />
        <div className=":uno: flex flex-col items-center justify-between text-sm text-link-lightest lg:flex-row">
          <div className=":uno: mb-4 font-medium lg:mb-0 text-style-body-lg">
            &copy;
            {' '}
            {currentYear}
            {' '}
            Porter. All rights reserved.
          </div>
          <div className=":uno: flex space-x-4">
            {Object.entries(FooterLinksSecondary).map(([key, section]) => (
              <div key={key} className=":uno: flex space-x-4">
                {section.links.map(link => (
                  <Link key={link.href} to={link.href} className=":uno: text-link-lightest no-underline hover:text-primary">
                    {link.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
