"use client";

import React from "react";
import { FREE_CREDITS_PER_DAY } from "../constants";
import StripeButton from "./stripe-button";
import { getSubscriptionStatus } from "@/lib/stripe-actions";

const PremiunBanner = () => {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  React.useEffect(() => {
    async () => {
      const subscriptionStatus = await getSubscriptionStatus();
      console.log("subscriptionStatus", subscriptionStatus);
      setIsSubscribed(subscriptionStatus);
    };
  }, []);

  const remainingCredits = 5;

  console.log("isSubscribed", isSubscribed);

  if (!isSubscribed) {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-gray-900 p-4 md:flex-row">
        <img
          src="/bot.webp"
          className="h-[180px] w-auto md:absolute md:-right-10 md:-bottom-6"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Basic Plan</h1>
            <p className="text-sm text-gray-400 md:max-w-full">
              {remainingCredits} / {FREE_CREDITS_PER_DAY} messages remaining
            </p>
          </div>
          <div className="h-4"></div>

          <p className="text-sm text-gray-400 md:max-w-[calc(100%-150px)]">
            Upgrade to pro to ask as many questions as you want
          </p>

          <div className="h-4"></div>

          <StripeButton />
        </div>
      </div>
    );
  }

  if (isSubscribed)
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-gray-900 p-4 md:flex-row">
        <img
          src="/bot.webp"
          className="h-[180px] w-auto md:absolute md:-right-10 md:-bottom-6"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Premium Plan</h1>
          </div>
          <div className="h-4"></div>

          <p className="text-sm text-gray-400 md:max-w-[calc(100%-150px)]">
            Ask as many questions as you want!
          </p>

          <div className="h-4"></div>

          <StripeButton />
        </div>
      </div>
    );

  return <div>PremiunBanner</div>;
};

export default PremiunBanner;
