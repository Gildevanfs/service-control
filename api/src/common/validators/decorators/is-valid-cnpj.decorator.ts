import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { isValidCnpj } from '../cnpj';

export function IsValidCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isValidCnpj(value);
        },
        defaultMessage(): string {
          return 'CNPJ inválido';
        },
      },
    });
  };
}