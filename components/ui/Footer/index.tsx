import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"
import { links } from "utils/links"

import { Logo } from "./cl"

export const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Links>
        <a href={links.impressum}>{t("footer.impressum")}</a>
        <a href={links.agb}>{t("termsContent.generalTerms")}</a>{" "}
        <a href={links.datenschutz}>{t("footer.dataProtection")}</a>
        <a href={links.widerrufsbelehrung}>{t("footer.rightOfWithdrawal")}</a>
        <a href={links.faq}>{t("footer.faq")}</a>
        <a href={links.kontakt}>{t("footer.contact")}</a>
      </Links>
      <LogoWrapper>
        {t("footer.poweredBy")}{" "}
        <Logo width="135" height="22" className="pl-2" />
      </LogoWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`md:flex fixed w-full flex-col bottom-0 justify-start border-t -mx-5 px-5 py-2 text-xs text-gray-400 bg-gray-50 z-30 md:(bottom-0 sticky p-0 py-3 m-0 mt-20)`}

  &::before {
    ${tw`hidden md:(block top-0 absolute left-0 w-full z-10 h-2 shadow-top)`}
    content: "";
  }
`
const LogoWrapper = styled.div`
  ${tw`flex items-center`}
`

const Links = styled.div`
  ${tw`flex gap-2 mb-5 text-black`}
`

export default Footer
