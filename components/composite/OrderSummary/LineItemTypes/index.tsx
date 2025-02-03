import { LineItemField } from "@commercelayer/react-components"
import {
  LineItem,
  TLineItem,
} from "@commercelayer/react-components/line_items/LineItem"
import LineItemAmount from "@commercelayer/react-components/line_items/LineItemAmount"
import LineItemImage from "@commercelayer/react-components/line_items/LineItemImage"
import LineItemName from "@commercelayer/react-components/line_items/LineItemName"
import LineItemOption from "@commercelayer/react-components/line_items/LineItemOption"
import LineItemQuantity from "@commercelayer/react-components/line_items/LineItemQuantity"
import cronParser from "cron-parser"
import cronstrue from "cronstrue"
import { useTranslation } from "next-i18next"
import React from "react"

import "cronstrue/locales/en"
import "cronstrue/locales/it"
import "cronstrue/locales/de"
import { RepeatIcon } from "../RepeatIcon"

import { FlexContainer } from "components/ui/FlexContainer"

import {
  LineItemDescription,
  LineItemQty,
  LineItemFrequency,
  LineItemTitle,
  LineItemWrapper,
  StyledLineItemSkuCode,
  StyledLineItemOptions,
} from "./styled"

interface DeliveryLeadTime {
  minHours: number
  maxHours: number
}

interface Props {
  type: TLineItem
}

const CODE_LOOKUP: { [k: string]: "sku_code" | "bundle_code" | undefined } = {
  skus: "sku_code",
  bundles: "bundle_code",
}

export const LineItemTypes: React.FC<Props> = ({ type }) => {
  const { t, i18n } = useTranslation()
  return (
    <LineItem type={type}>
      <LineItemWrapper data-testid={`line-items-${type}`}>
        <LineItemImage
          width={85}
          className="self-start p-1 bg-white border rounded"
        />
        <LineItemDescription>
          <StyledLineItemSkuCode type={CODE_LOOKUP[type]} />
          <LineItemTitle>
            <LineItemName className="font-bold" />
            <LineItemAmount
              data-testid="line-item-amount"
              className="pl-2 text-lg font-extrabold"
            />
          </LineItemTitle>
          <StyledLineItemOptions showAll showName={true} className="options">
            <LineItemOption />
          </StyledLineItemOptions>

          <LineItemField attribute="metadata">
            {/* @ts-expect-error typing on attribute */}
            {({ attributeValue }) => {
              if (!attributeValue || typeof attributeValue !== "object")
                return null

              const metadata = attributeValue as Record<string, unknown>
              const deliveryLeadTimeStr = metadata.deliveryLeadTime
              if (
                !deliveryLeadTimeStr ||
                typeof deliveryLeadTimeStr !== "string"
              )
                return null

              const deliveryTime = JSON.parse(
                deliveryLeadTimeStr
              ) as DeliveryLeadTime

              if (!deliveryTime) return null

              const minDays = Math.ceil(deliveryTime.minHours / 24)
              const maxDays = Math.ceil(deliveryTime.maxHours / 24)

              return (
                <div className="flex text-xs gap-1">
                  <div className="font-semibold text-gray-400">
                    {t("item.availability")}:
                  </div>
                  <span>
                    {maxDays >= 10
                      ? minDays === maxDays
                        ? `${Math.round(minDays / 7)} ${t("item.weeks")}`
                        : `${Math.round(minDays / 7)}-${Math.round(
                            maxDays / 7
                          )} ${t("item.weeks")}`
                      : minDays === maxDays
                      ? `${minDays} ${t("item.days")}`
                      : `${minDays}-${maxDays} ${t("item.days")}`}
                  </span>
                </div>
              )
            }}
          </LineItemField>
          <FlexContainer className="flex-col justify-between mt-2 lg:flex-row">
            <LineItemQty>
              <LineItemQuantity>
                {(props) => (
                  <>
                    {!!props.quantity &&
                      t("orderRecap.quantity", { count: props.quantity })}
                  </>
                )}
              </LineItemQuantity>
            </LineItemQty>
            <LineItemField attribute="frequency">
              {/*  @ts-expect-error typing on attribute */}
              {({ attributeValue }) => {
                if (!attributeValue) {
                  return null
                }
                let isCronValid = true
                try {
                  cronParser.parseExpression(attributeValue as string)
                } catch (e) {
                  isCronValid = false
                }
                const frequency = isCronValid
                  ? cronstrue.toString(attributeValue as string, {
                      locale: i18n.language,
                    })
                  : t(`orderRecap.frequency.${attributeValue}`)

                return (
                  <LineItemFrequency data-testid="line-items-frequency">
                    <RepeatIcon />
                    {frequency}
                  </LineItemFrequency>
                )
              }}
            </LineItemField>
          </FlexContainer>
        </LineItemDescription>
      </LineItemWrapper>
    </LineItem>
  )
}
