import { useTranslation } from "react-i18next"
import { styled } from "styled-components"
import tw from "twin.macro"
import { links } from "utils/links"

const TermsContent = () => {
  const { t } = useTranslation()

  return (
    <Terms>
      {t("termsContent.orderAcceptance")}{" "}
      <span>
        {" "}
        <a
          href={links.agb}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          {t("termsContent.generalTerms")}
        </a>{" "}
      </span>
      {t("termsContent.commaDas")}
      <span>
        {" "}
        <a
          href={links.widerrufsbelehrung}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          {t("termsContent.rightOfWithdrawal")}
        </a>{" "}
      </span>
      {t("termsContent.andDie")}
      <span>
        {" "}
        <a
          href={links.datenschutz}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          {t("termsContent.dataProtection")}
        </a>{" "}
      </span>
      {t("termsContent.asWellAsDie")}
      <span>
        {" "}
        <a
          href={links.kontakt}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          {t("termsContent.returnInstructions")}
        </a>{" "}
      </span>
      {t("termsContent.acknowledgement")}
    </Terms>
  )
}

const Terms = styled.p`
  ${tw`inline`}
`

export default TermsContent
