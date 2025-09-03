import pricingData from './price.json';

export const fetchUserLocationPricing = async () => {
  // 1) Get user's full country name from API
  const locationResponse = await fetch('https://ipapi.co/json/');
  const locationData = await locationResponse.json();

  const userCountryName = locationData.country_name?.toLowerCase() || "";

  // 2) Find the Monthly subscription
  const monthlyPriceEntry = pricingData.find(
    (item: any) =>
      item.country_name?.toLowerCase() === userCountryName &&
      item["Annual/ Monthly"] === 1
  );

  // 3) Find the Annual subscription
  const annualPriceEntry = pricingData.find(
    (item: any) =>
      item.country_name?.toLowerCase() === userCountryName &&
      item["Annual/ Monthly"] === 12
  );

  // 4) Return result or fallback values
  return {
    country: monthlyPriceEntry?.country_name || annualPriceEntry?.country_name || "International",
    currencySymbol:
      monthlyPriceEntry?.["Symbol.1"]?.trim() ||
      annualPriceEntry?.["Symbol.1"]?.trim() ||
      "€",
    monthlyPrice: monthlyPriceEntry ? monthlyPriceEntry.Amount.toString() : "9.9",
    annualPrice: annualPriceEntry ? annualPriceEntry.Amount.toString() : "119.9",
    currencyCode: monthlyPriceEntry?.Symbol || annualPriceEntry?.Symbol || "EUR",
  };
  
};
