import styled from "styled-components"
import tw from "twin.macro"
import { links } from "utils/links"

import { Logo } from "./cl"

export const Footer: React.FC = () => {
  return (
    <Wrapper>
      <Links>
        <a href={links.impressum}>Impressum</a>
        <a href={links.agb}>AGB</a>
        <a href={links.datenschutz}>Datenschutz</a>
        <a href={links.widerrufsbelehrung}>Widerrufsbelehrung</a>
        <a href={links.faq}>FAQ</a>
        <a href={links.kontakt}>Kontakt</a>
      </Links>
      <LogoWrapper>
        Powered by <Logo width="135" height="22" className="pl-2" />
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
