import { onlyDigits } from './utils';

function calculateCheckDigit(digits: number[], startWeight: number): number {
  const sum = digits.reduce(
    (acc, digit, i) => acc + digit * (startWeight - i),
    0,
  );
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11) {
    return false;
  }
  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  const numbers = digits.split('').map(Number);
  if (calculateCheckDigit(numbers.slice(0, 9), 10) !== numbers[9]) {
    return false;
  }
  return calculateCheckDigit(numbers.slice(0, 10), 11) === numbers[10];
}