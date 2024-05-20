import type { Order } from "@commercelayer/sdk"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { FlexContainer } from "components/ui/FlexContainer"
import { SpinnerIcon } from "components/ui/SpinnerIcon"

import { ErrorIcon } from "./ErrorIcon"
import { messages } from "./messages"
import {
  ErrorIco,
  ErrorMessage,
  ErrorsContainer,
  ErrorWrapper,
  StyledErrors,
  StyledPlaceOrderButton,
  PlaceOrderButtonWrapper,
} from "./styled"
import TermsContent from "./TermsContent"

interface Props {
  isActive: boolean
  termsUrl: NullableType<string>
  privacyUrl: NullableType<string>
}

const StepPlaceOrder: React.FC<Props> = ({ isActive }) => {
  const { t } = useTranslation()

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const appCtx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)

  if (!appCtx) {
    return null
  }

  const { placeOrder } = appCtx

  const handlePlaceOrder = async ({
    placed,
    order,
  }: {
    placed: boolean
    order?: Order
  }) => {
    if (placed) {
      setIsPlacingOrder(true)
      await placeOrder(order)
      if (gtmCtx?.firePurchase && gtmCtx?.fireAddPaymentInfo) {
        await gtmCtx.fireAddPaymentInfo()
        await gtmCtx.firePurchase()
      }
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      <ErrorsContainer data-testid="errors-container">
        <StyledErrors
          resource="orders"
          messages={
            messages &&
            messages.map((msg) => {
              return { ...msg, message: t(msg.message) }
            })
          }
        >
          {(props) => {
            if (props.errors?.length === 0) {
              return null
            }
            const compactedErrors = props.errors
            return (
              <>
                {compactedErrors?.map((error, index) => {
                  if (error?.trim().length === 0 || !error) {
                    return null
                  }
                  return (
                    <ErrorWrapper key={index}>
                      <ErrorIco>
                        <ErrorIcon />
                      </ErrorIco>
                      <ErrorMessage>{error}</ErrorMessage>
                    </ErrorWrapper>
                  )
                })}
              </>
            )
          }}
        </StyledErrors>
      </ErrorsContainer>

      <>
        <FlexContainer className="items-start mx-5 mt-4 mb-2.5 md:mb-5 md:pb-5 md:mx-0 md:mt-0 md:border-b ">
          <TermsLabel htmlFor="accept-terms">
            <TermsInput
              type="checkbox"
              name="terms"
              id="accept-terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <TermsContent />
          </TermsLabel>
        </FlexContainer>

        <PlaceOrderButtonWrapper>
          <StyledPlaceOrderButton
            data-testid="save-payment-button"
            isActive={isActive}
            isTermsAccepted={acceptedTerms}
            onClick={handlePlaceOrder}
            label={
              <>
                {isPlacingOrder && <SpinnerIcon />}
                {t("stepPayment.submit")}
              </>
            }
          />
        </PlaceOrderButtonWrapper>
      </>
    </>
  )
}

const TermsLabel = styled.label`
  ${tw`mb-5`}
`

const TermsInput = styled.input`
  ${tw`mr-2`}
`

export default StepPlaceOrder
