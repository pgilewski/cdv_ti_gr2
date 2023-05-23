import { SetMetadata } from '@nestjs/common';

import { AuthType } from '../enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

// setMetadata takes two parameters: metadata key and metadata value which we want to store for this key
export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
