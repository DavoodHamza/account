import { Store } from "../redux/store";

function numberToWords(amount: any) {
  const User: any = Store.getState().User;

  // Basic number arrays
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  // Convert numbers below 100
  function convertBelow100(num: any) {
    if (num < 10) {
      return ones[num];
    } else if (num >= 11 && num <= 19) {
      return teens[num - 10];
    } else {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    }
  }

  // Convert numbers below 1000
  function convertBelow1000(num: any) {
    if (num < 100) {
      return convertBelow100(num);
    } else {
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " and " + convertBelow100(num % 100) : "")
      );
    }
  }

  // Main conversion function using international numbering
  function convert(amount: any) {
    if (amount === 0) {
      return "Zero";
    }

    amount = parseInt(amount);
    let billions = Math.floor(amount / 1000000000);
    let millions = Math.floor((amount % 1000000000) / 1000000);
    let thousands = Math.floor((amount % 1000000) / 1000);
    let remainder = amount % 1000;
    let result = "";

    if (billions > 0) {
      result += convertBelow1000(billions) + " Billion";
      if (millions > 0 || thousands > 0 || remainder > 0) {
        result += " ";
      }
    }

    if (millions > 0) {
      result += convertBelow1000(millions) + " Million";
      if (thousands > 0 || remainder > 0) {
        result += " ";
      }
    }

    if (thousands > 0) {
      result += convertBelow1000(thousands) + " Thousand";
      if (remainder > 0) {
        result += " ";
      }
    }

    if (remainder > 0) {
      result += convertBelow1000(remainder);
    }
    return result;
  }
function wordsSplit(amount: any) {
  // Get currency details from user state
  const currency = User.user?.companyInfo?.countryInfo?.currency || '';
  const subcurrency = User.user?.companyInfo?.countryInfo?.subcurrency || '';

  if (Number.isInteger(amount)) {
    return `${convert(amount)} ${currency}${Number(amount) !== 1 ? 's' : ''}`;
  } else {
    const [integerPart, decimalPart] = amount.toString().split(".");
    const words = convert(parseInt(integerPart));
    // Only convert decimal part and display subcurrency if it's greater than 0
    const decimalValue = parseInt(decimalPart);
    const words2 = decimalValue > 0 ? convert(decimalValue) : "";

    return (
      `${words} ${currency}${parseInt(integerPart) !== 1 ? '' : ''}` +
      (words2 && decimalValue > 0 && subcurrency ? ` and ${words2} ${subcurrency}${decimalValue !== 1 ? '' : ''}` : "")
    );
  }
}

  return wordsSplit(amount);
}

export { numberToWords };