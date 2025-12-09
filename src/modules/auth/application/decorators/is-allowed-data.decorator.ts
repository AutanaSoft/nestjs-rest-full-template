import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * List of prohibited domains for registration.
 * This list restricts the use of disposable or internal mail domains.
 */
const FORBIDDEN_DOMAINS = ['test.com', 'example.com', 'mailinator.com', '10minutemail.com'];

/**
 * List of prohibited usernames.
 * Prevents users from registering with administrative or reserved names.
 */
const FORBIDDEN_USERNAMES = ['admin', 'root', 'bot', 'system', 'support', 'superuser'];

@ValidatorConstraint({ async: false })
export class IsAllowedDataConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [dataType] = args.constraints;

    if (typeof value !== 'string') {
      return false;
    }

    if (dataType === 'email') {
      const domain = value.split('@')[1];
      return !FORBIDDEN_DOMAINS.includes(domain);
    }

    if (dataType === 'username') {
      return !FORBIDDEN_USERNAMES.includes(value.toLowerCase());
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [dataType] = args.constraints;
    if (dataType === 'email') {
      return 'The email domain is not allowed.';
    }
    if (dataType === 'username') {
      return 'The username is not allowed.';
    }
    return 'Invalid data.';
  }
}

/**
 * Decorator to validate if the data is allowed based on business rules.
 * Supports validation for 'email' and 'username'.
 *
 * @param dataType - Type of data to validate ('email' | 'username').
 * @param validationOptions - Additional validation options.
 */
export function IsAllowedData(
  dataType: 'email' | 'username',
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [dataType],
      validator: IsAllowedDataConstraint,
    });
  };
}
