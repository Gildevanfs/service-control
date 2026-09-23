import { onlyDigits } from './utils';

const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calculateCheckDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14) {
    return false;
  }
  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  const numbers = digits.split('').map(Number);
  if (
    calculateCheckDigit(numbers.slice(0, 12), FIRST_WEIGHTS) !== numbers[12]
  ) {
    return false;
  }
  return (
    calculateCheckDigit(numbers.slice(0, 13), SECOND_WEIGHTS) === numbers[13]
  );
}