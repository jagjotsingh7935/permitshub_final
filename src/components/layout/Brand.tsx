import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import { useSite } from '../../site/SiteProvider'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  const { t, settings } = useSite()
  return (
    <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label={`${settings.brandPrimary}${settings.brandSecondary} home`}>
      {settings.logo && <img src={mediaUrl(settings.logo)} alt="" width="42" height="42" />}
      <span>{settings.brandPrimary}<span className="brand__light">{settings.brandSecondary}</span><small>{t('brand.tagline')}</small></span>
    </Link>
  )
}
