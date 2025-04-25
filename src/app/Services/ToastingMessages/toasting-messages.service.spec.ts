import { TestBed } from '@angular/core/testing';

import { ToastingMessagesService } from './toasting-messages.service';

describe('ToastingMessagesService', () => {
  let service: ToastingMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastingMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
