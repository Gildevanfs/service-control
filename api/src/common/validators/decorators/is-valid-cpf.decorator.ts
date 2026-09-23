import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { isValidCpf } from '../cpf';

export function IsValidCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCpf',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isValidCpf(value);
        },
        defaultMessage(): string {
          return 'CPF inválido';
        },
      },
    });
  };
}