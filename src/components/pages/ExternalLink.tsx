import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** A link to another website. Opens in a new tab without giving that site access to this page. */
export const ExternalLink = ({
  href,
  children,
  className = '',
  icon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) => {
  const { t } = useTranslation('about');
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {icon && <ArrowUpRight className="ml-1 inline h-4 w-4 shrink-0 align-[-2px]" aria-hidden="true" />}
      <span className="sr-only"> {t('opensNewTab')}</span>
    </a>
  );
};

export default ExternalLink;
