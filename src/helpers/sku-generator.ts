export function SKUGenerator(num: number) {
    const zerosNeeded = Math.max(0, 4 - Math.floor(Math.log10(num) + 1));
    const paddedNumber = "0".repeat(zerosNeeded) + num;
    return "CNU-" + paddedNumber;
  }
  