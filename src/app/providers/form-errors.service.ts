import { Injectable } from '@angular/core';

@Injectable()
export class FormErrorsService {

    public validationMessages = {
        name: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        email: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        location: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        membership: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        price: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        fee: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        trial: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        trial_days: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        age: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        classes: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        },
        information: {
            required: 'Field is required',
            pattern : 'Please, insert valid value'
        }
    };
    public getErrors(form, errors, data?) {
        if (!form) return;

        for ( const field in errors ) {
            errors[field] = '';
            const control = form.get(field);
            if (control && control.touched) {
                const message = this.validationMessages[field];
                for (const key in control.errors) {
                    errors[field] += message[key] + ' ';
                }
            }
        }
        return errors;
    }
}
