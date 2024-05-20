import { styled } from "styled-components"
import tw from "twin.macro"
import { links } from "utils/links"

const TermsContent = () => {
  return (
    <Terms>
      Mit Ihrer Bestellung nehmen Sie unsere{" "}
      <span>
        {" "}
        <a
          href={links.agb}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          AGB
        </a>{" "}
      </span>
      , das
      <span>
        {" "}
        <a
          href={links.widerrufsbelehrung}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          Widerrufsrecht
        </a>{" "}
      </span>
      und die
      <span>
        {" "}
        <a
          href={links.datenschutz}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          Datenschutzbestimmungen
        </a>{" "}
      </span>
      sowie die
      <span>
        {" "}
        <a
          href={links.kontakt}
          target="_blank"
          style={{ textDecoration: "underline" }}
          rel="noreferrer"
        >
          Ruckgabenhinweise
        </a>{" "}
      </span>
      zur Kenntnis.
    </Terms>
  )
}

const Terms = styled.p`
  ${tw`inline`}
`

export default TermsContent
