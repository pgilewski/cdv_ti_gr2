import { Injectable } from '@nestjs/common';

// abstract as we want it to act as an interface of hashing service abstraction
@Injectable()
export abstract class HashingService {
  // returns a hashed string
  abstract hash(data: string | Buffer): Promise<string>;
  // data to be encrypted, encrypted being the data to be compared against
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
