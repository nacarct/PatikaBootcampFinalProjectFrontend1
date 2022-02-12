import { TestBed } from '@angular/core/testing';

import { PaymentLineService } from './payment-line.service';

describe('PaymentLineService', () => {
  let service: PaymentLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
