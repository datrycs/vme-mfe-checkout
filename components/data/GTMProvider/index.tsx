import { LineItem, Order } from "@commercelayer/sdk"
import { createContext, useEffect, useContext, useRef } from "react"
import TagManager from "react-gtm-module"

import { AppContext } from "components/data/AppProvider"
import type { TypeAccepted } from "components/data/AppProvider/utils"
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"

import { DataLayerItemProps, DataLayerProps } from "./typings"

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        statistics?: boolean
        marketing?: boolean
        preferences?: boolean
        necessary?: boolean
      }
    }
  }
}

interface GTMProviderData {
  fireAddShippingInfo: (order: Order) => void
  fireAddPaymentInfo: () => void
  firePurchase: () => void
}

export const GTMContext = createContext<GTMProviderData | null>(null)

interface GTMProviderProps {
  children: React.ReactNode
  gtmId: NullableType<string>
}

export const GTMProvider: React.FC<GTMProviderProps> = ({
  children,
  gtmId,
}) => {
  const isFirstLoading = useRef(true)

  if (!gtmId) {
    return <>{children}</>
  }
  const ctx = useContext(AppContext)

  if (!ctx) {
    return <>{children}</>
  }

  const { order } = ctx

  useEffect(() => {
    let handleConsent: (() => void) | null = null

    if (isFirstLoading.current && gtmId != null && order != null) {
      isFirstLoading.current = false

      // Always initialize GTM - Google's Advanced Consent Mode handles consent internally
      TagManager.initialize({ gtmId })

      // For begin_checkout event, check consent if Cookiebot is present
      if (
        typeof window !== "undefined" &&
        window.Cookiebot &&
        process.env.NEXT_PUBLIC_COOKIEBOT_ID
      ) {
        if (window.Cookiebot.consent?.statistics) {
          // User has already consented to statistics/analytics
          // TODO: `skipBeginCheckout` should probably be used. It had been added to Roomio checkout but not for Trendhopper.
          // See https://github.com/datrycs/roomio-mfe-checkout/commit/5b4c3c4d93f59f7f875711f4d71f9a09b986fb53
          //
          // if (!skipBeginCheckout) {
          fireBeginCheckout(order)
          // }
        } else {
          // Wait for consent before firing the event
          handleConsent = () => {
            if (window.Cookiebot?.consent?.statistics) {
              // if (!skipBeginCheckout) {
              fireBeginCheckout(order)
              // }
              // Remove listener after firing
              if (handleConsent) {
                window.removeEventListener("CookiebotOnAccept", handleConsent)
              }
            }
          }
          window.addEventListener("CookiebotOnAccept", handleConsent, false)
        }
      } else {
        // No Cookiebot - fire event immediately
        // if (!skipBeginCheckout) {
        fireBeginCheckout(order)
        // }
      }
    }

    // Cleanup function to remove event listener on unmount
    return () => {
      if (handleConsent) {
        window.removeEventListener("CookiebotOnAccept", handleConsent)
      }
    }
  }, [order])

  const pushDataLayer = ({ eventName, dataLayer }: DataLayerProps) => {
    try {
      TagManager.dataLayer({
        dataLayer: {
          event: eventName,
          ecommerce: dataLayer,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const mapItemsToGTM = ({
    name,
    currency_code,
    sku_code,
    bundle_code,
    quantity,
    total_amount_float,
  }: LineItem): DataLayerItemProps => {
    return {
      item_id: sku_code || bundle_code,
      item_name: name,
      price: total_amount_float,
      currency: currency_code,
      quantity,
    }
  }

  const fireBeginCheckout = (order: Order) => {
    const lineItems = order.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    return pushDataLayer({
      eventName: "begin_checkout",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        value: order?.total_amount_with_taxes_float,
      },
    })
  }

  const fireAddShippingInfo = (order: Order) => {
    const shipments = order?.shipments

    shipments?.forEach((shipment) => {
      const lineItems = shipment.stock_line_items?.map(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (e) => e && mapItemsToGTM(e.line_item)
      )

      pushDataLayer({
        eventName: "add_shipping_info",
        dataLayer: {
          coupon: order?.coupon_code,
          currency: order?.currency_code,
          items: lineItems,
          value: shipment.shipping_method?.price_amount_for_shipment_float,
          shipping_tier: shipment.shipping_method?.name,
        },
      })
    })
  }

  const fireAddPaymentInfo = () => {
    const lineItems = order?.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    const paymentMethod = order?.payment_method

    return pushDataLayer({
      eventName: "add_payment_info",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        value: paymentMethod?.price_amount_float,
        payment_type: paymentMethod?.name,
      },
    })
  }

  const firePurchase = () => {
    const lineItems = order?.line_items?.filter((line_item) => {
      return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
    })

    return pushDataLayer({
      eventName: "purchase",
      dataLayer: {
        coupon: order?.coupon_code,
        currency: order?.currency_code,
        items: lineItems?.map(mapItemsToGTM),
        transaction_id: order?.number,
        shipping: order?.shipping_amount_float,
        value: order?.total_amount_with_taxes_float,
        tax: order?.total_tax_amount_float,
      },
    })
  }

  return (
    <GTMContext.Provider
      value={{
        fireAddShippingInfo,
        fireAddPaymentInfo,
        firePurchase,
      }}
    >
      {children}
    </GTMContext.Provider>
  )
}
