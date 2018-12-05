import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { PaymentService } from '../../app/services/payment.service';

@Component({
  selector: 'opn-payment-stripe',
  templateUrl: './payment-stripe.component.html',
  styleUrls: ['./payment-stripe.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ PaymentService ],
})
export class PaymentStripeComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  @ViewChild('card') cardRef: ElementRef;
  @ViewChild('error') errorRef: ElementRef;
  @ViewChild('payForm') payFormRef: ElementRef;
  @ViewChild('current') currentRef: ElementRef;
  @ViewChild('selectOptions') selectOptionsRef: ElementRef;

  private showPay: Boolean = false;

  elementsOptions: ElementsOptions = {
    locale: 'en',
  };
  stripePayment: FormGroup;

  @Output() outToken: EventEmitter<any> = new EventEmitter<any>();

  private meCards: any = [];
  private addStatus: Boolean = true;
  private openSelect: Boolean = false;
  private paymentType: String = '';
  private cardToken: String = '';
  private process: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentSrv: PaymentService,
  ) {}

  ngOnInit() {
    this.payFormRef.nativeElement.style = 'display: none';
    this.selectOptionsRef.nativeElement.style = 'display: none';
    this.addStatus = false;
    if (this.paymentType === '') {
      this.currentRef.nativeElement.textContent = 'Select your card';
    }
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            hidePostalCode: true,
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#202f3b',
                lineHeight: '50px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '15px',
              },
            },
          });
        }
      });
    this.getMyCards();
  }

  getMyCards() {
    this.paymentSrv.getCards().subscribe(cards => {
      this.meCards = cards;
      this.checkMetod(cards);
    });
  }
  checkMetod(cards) {
    if (cards.length == 0) {
      this.onNewCard();
    }
  }

  public showPayment() {
    this.getMyCards();
    this.errorRef.nativeElement.textContent = '';
    document.body.classList.add('openModal');
    this.payFormRef.nativeElement.style = 'display: block';
    if (this.addStatus) {
      this.card.mount(this.cardRef.nativeElement);
    }
  }

  public onClose() {
    document.body.classList.remove('openModal');
    this.payFormRef.nativeElement.style = 'display: none';
    this.card.unmount();
    this.process = false;
  }

  onSelectCard(card) {
    this.currentRef.nativeElement.textContent = `${card.brand} **** **** **** ${card.last4}`;
    this.addStatus = false;
    this.card.unmount();
    this.paymentType = 'select';
    this.cardToken = card.id;
  }

  onNewCard() {
    this.currentRef.nativeElement.textContent = 'New Card';
    this.addStatus = true;
    this.card.mount(this.cardRef.nativeElement);
    this.paymentType = 'new';
  }
  onToggle(e) {
    e.preventDefault();
    this.openSelect = !this.openSelect;
    this.statusSelect(this.openSelect);
  }
  statusSelect(visible) {
    this.openSelect = visible;
    this.selectOptionsRef.nativeElement.style = `display: ${(visible) ? 'block' : 'none'}`;
  }
  public getToken() {
    switch (this.paymentType) {
      case 'new': {
        this.process = true;
        this.stripeService
        .createToken(this.card, {})
        .subscribe(result => {
          if (result.token) {
            this.outToken.emit({
              type: 'token',
              id: result.token.id,
            });
            this.onClose();
          } else if (result.error) {
            this.errorRef.nativeElement.textContent = result.error.message;
          }
          this.process = false;
        });
        break;
      }
      case 'select': {
        this.outToken.emit({
          type: 'card',
          id: this.cardToken,
        });
        this.onClose();
        break;
      }
    }
  }

}
