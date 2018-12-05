import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

@Component({
  selector: 'opn-payment-stripe',
  templateUrl: './payment-stripe.component.html',
  styleUrls: ['./payment-stripe.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PaymentStripeComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  @ViewChild('card') cardRef: ElementRef;
  @ViewChild('error') errorRef: ElementRef;

  elementsOptions: ElementsOptions = {
    locale: 'en',
  };
  stripePayment: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService) {}

  ngOnInit() {
    this.stripePayment = this.fb.group({
      name: ['', [Validators.required]],
    });
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
          this.card.mount(this.cardRef.nativeElement);
        }
      });
  }

  buy() {
    const name = this.stripePayment.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          this.errorRef.nativeElement.textContent = result.error.message;
        }
      });
  }

}
