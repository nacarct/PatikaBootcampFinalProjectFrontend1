import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {CustomerService} from "../../services/customer/customer.service";
import {Product} from "../../models/product.model";
import {Customer} from "../../models/customer.model";
import {ProductService} from "../../services/product/product.service";
import {Policy} from "../../models/policy.model";
import {PolicyService} from "../../services/policy/policy.service";
import {PaymentService} from "../../services/payment/payment.service";
import {Payment} from "../../models/payment.model";
import {PaymentLineService} from "../../services/paymentLine/payment-line.service";
import {PaymentLine} from "../../models/paymentLine.model";

export interface PayLine{
  PartInfo: string;
  PartPrice: number;
}

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})

export class PolicyComponent implements OnInit {

  isEditable = false;

  isOwn = false;

  firstFormCheck: boolean = false;
  secondFormCheck: boolean = false;
  thirdFormCheck: boolean = false;
  fourthFormCheck: boolean = false;

  dataSaved: boolean = false;

  partCount: number = 1;

  payLine: PayLine[] = [];
  products: Product[] = [];

  insurer: Customer = {
    customerId: 0,
    customerTcKn: '',
    firstName: '',
    lastName: '',
    birthDate: new Date(),
    gender: '',
    phone: '',
    address: '',
    height: 0,
    weight: 0,
    relation: ''
  };

  insured: Customer = {
    customerId: 0,
    customerTcKn: '',
    firstName: '',
    lastName: '',
    birthDate: new Date(),
    gender: '',
    phone: '',
    address: '',
    height: 0,
    weight: 0,
    relation: ''
  };

  selectedProduct: Product | any = {productId:0, productName: '', price:0};

  firstFormGroup = new FormGroup({
    customerId: new FormControl('',Validators.required),
    tcKn: new FormControl('',Validators.required),
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('',Validators.required),
    birthDate: new FormControl('',Validators.required),
    gender: new FormControl('',Validators.required),
    phone: new FormControl(''),
    address: new FormControl(''),
    ownInsurer: new FormControl(''),
  });

  secondFormGroup = new FormGroup({
    customerId2: new FormControl('',Validators.required),
    tcKn2: new FormControl('',Validators.required),
    firstName2: new FormControl('',Validators.required),
    lastName2: new FormControl('',Validators.required),
    birthDate2: new FormControl('',Validators.required),
    gender2: new FormControl('',Validators.required),
    phone2: new FormControl(''),
    address2: new FormControl(''),
    height: new FormControl('',Validators.required),
    weight: new FormControl('',Validators.required),
    relation: new FormControl('',Validators.required),
  });

  thirdFormGroup = new FormGroup({
    product: new FormControl('', Validators.required)
  });

  fourthFormGroup = new FormGroup({
    paymentPart: new FormControl('', Validators.required)
  });

  submitFirstForm(){
    if (this.firstFormGroup.valid){
      this.firstFormCheck = true;
      let ownInsurer = false;



      for(let item in this.firstFormGroup.controls){
        this.firstFormGroup.get(item.toString())?.disable({ onlySelf: true });
        if(this.firstFormGroup.get('ownInsurer')?.value===true)
          ownInsurer=true;
      }

      this.insurer = {
        customerId: this.firstFormGroup.get('customerId')?.value,
        customerTcKn: this.firstFormGroup.get('tcKn')?.value,
        firstName: this.firstFormGroup.get('firstName')?.value,
        lastName: this.firstFormGroup.get('lastName')?.value,
        birthDate: this.firstFormGroup.get('birthDate')?.value,
        gender: this.firstFormGroup.get('gender')?.value,
        phone: this.firstFormGroup.get('phone')?.value,
        address: this.firstFormGroup.get('address')?.value,
        height: 0,
        weight: 0,
        relation: ''
      };

      if (ownInsurer){
        this.isOwn = true;
        this.secondFormGroup.controls['relation'].setValue('Kendisi')
        this.secondFormGroup.controls['relation'].disable({ onlySelf: true });

        for(let item in this.firstFormGroup.controls){
          if(item !== 'ownInsurer'){
            this.secondFormGroup.controls[item.toString()+'2'].setValue(this.firstFormGroup.get(item.toString())?.value)
            this.secondFormGroup.controls[item.toString()+'2'].disable({ onlySelf: true });
          }

        }
      }
    }
    else {
      console.log("Error Insurer Form Data!");
    }
  }

  submitSecondForm(){
    if (this.secondFormGroup.valid){
      this.secondFormCheck = true;

      this.insured = {
        customerId: this.firstFormGroup.get('customerId2')?.value,
        customerTcKn: this.secondFormGroup.get('tcKn2')?.value,
        firstName: this.secondFormGroup.get('firstName2')?.value,
        lastName: this.secondFormGroup.get('lastName2')?.value,
        birthDate: this.secondFormGroup.get('birthDate2')?.value,
        gender: this.secondFormGroup.get('gender2')?.value,
        phone: this.secondFormGroup.get('phone2')?.value,
        address: this.secondFormGroup.get('address2')?.value,
        height: this.secondFormGroup.get('height')?.value,
        weight: this.secondFormGroup.get('weight')?.value,
        relation: this.secondFormGroup.get('relation')?.value
      };

      if (this.isOwn)
        this.insured.customerId = this.insurer.customerId;

      for(let item in this.secondFormGroup.controls){
        this.secondFormGroup.get(item.toString())?.disable({ onlySelf: true });
      }
    }
    else {
      console.log("Error Insured Form Data!");
    }
  }

  submitThirdForm(){
    if (this.thirdFormGroup.valid){
      this.thirdFormCheck = true;
      this.secondFormGroup.get('product')?.disable({ onlySelf: true });

      this.selectedProduct = this.products.find( x => x.productId === this.thirdFormGroup.get('product')?.value);
    }
    else {
      console.log("Error Product Form Data!");
    }
  }

  submitFourthForm(){
    if (this.fourthFormGroup.valid){
      this.fourthFormCheck=true;
      this.fourthFormGroup.get('paymentPart')?.disable({ onlySelf: true });
      this.saveData();
    }
    else {
      console.log("Error Payment Form Data!");
    }
  }

  calculatePaymentPart(){
    this.payLine = [];

    for (let i = 1; i<=this.partCount; i++){
      let partInfo = i.toString() + ". Taksit";
      let partPrice = (this.selectedProduct.price / this.partCount);
      this.payLine.push({PartInfo: partInfo, PartPrice: partPrice});
    }
  }

  constructor(private _formBuilder: FormBuilder,
              private customerService: CustomerService,
              private productService: ProductService,
              private policyService: PolicyService,
              private paymentService: PaymentService,
              private paymentLineService: PaymentLineService) {}

  policy:Policy = {
    policyNo: '-',
    insurerId: 0,
    insuredId: 0,
    productId: 0,
    createDate: new Date(),
    amount: 0,
    isPaid: '',
    height: 0,
    weight: 0,
    relation: '',
  }

  policyNo = '';

  saveData(){
    this.policy = {
      policyNo: '-',
      insurerId: this.insurer.customerId,
      insuredId: this.insured.customerId,
      productId: this.selectedProduct.productId,
      createDate: new Date(),
      amount: this.selectedProduct.price,
      isPaid: '0',
      height: this.insured.height,
      weight: this.insured.weight,
      relation: this.insured.relation,
    };

    console.log(this.policy);

    this.policyService.addPolicy(this.policy).subscribe( response => {
      console.log(response);
        if (response.statusCode === 200){
          this.policyNo = response.data.policyNo;

          let payment: Payment ={
            policyId:response.data.policyId,
            isAllPaid:'0',
            paymentPart: this.partCount,
            paymentAmount:this.selectedProduct.price
          };

          console.log(payment);

          this.paymentService.addPayment(payment).subscribe( pResponse => {
            console.log(pResponse);
            if (pResponse.statusCode === 200){

              let paymentLine: PaymentLine = {
                paymentId: pResponse.data.paymentId,
                partNo: 0,
                amount: 0,
                isPaid: '0'
              };

              for (let i = 1; i <= this.partCount; i++){
                paymentLine.partNo = i;
                paymentLine.amount = (this.selectedProduct.price / this.partCount);

                console.log(paymentLine);

                this.paymentLineService.addPaymentLine(paymentLine).subscribe( plResponse => {
                  console.log(plResponse);
                  if (plResponse.statusCode === 200){
                    this.dataSaved = true;
                  }
                });

              }

            }
          });
        }
      });
  }

  ngOnInit() {

    this.productService.getAllProducts().subscribe( response => {
      if(response.statusCode === 200){
        this.products = response.data;
      }
    });

    this.firstFormGroup.get('tcKn')?.valueChanges.subscribe( x => {
      if (x.toString().length === 11){
        this.customerService.getCustomerByTcKn(this.firstFormGroup.get('tcKn')?.value).subscribe(
          response => {
            if (response.statusCode === 200){
              this.firstFormGroup.controls['customerId'].setValue(response.data.customerId);
              this.firstFormGroup.controls['firstName'].setValue(response.data.firstName);
              this.firstFormGroup.controls['lastName'].setValue(response.data.lastName);
              this.firstFormGroup.controls['birthDate'].setValue(new Date(response.data.birthDate.toString()));
              this.firstFormGroup.controls['gender'].setValue(response.data.gender);
              this.firstFormGroup.controls['phone'].setValue(response.data.phone);
              this.firstFormGroup.controls['address'].setValue(response.data.address);
            }
            else
              console.log('Customer not found!');
          }
        );
      }
    });

    this.secondFormGroup.get('tcKn2')?.valueChanges.subscribe( x => {
      if (x.toString().length === 11){
        this.customerService.getCustomerByTcKn(this.secondFormGroup.get('tcKn2')?.value).subscribe(
          response => {
            if (response.statusCode === 200){
              this.secondFormGroup.controls['customerId2'].setValue(response.data.customerId);
              this.secondFormGroup.controls['firstName2'].setValue(response.data.firstName);
              this.secondFormGroup.controls['lastName2'].setValue(response.data.lastName);
              this.secondFormGroup.controls['birthDate2'].setValue(new Date(response.data.birthDate.toString()));
              this.secondFormGroup.controls['gender2'].setValue(response.data.gender);
              this.secondFormGroup.controls['phone2'].setValue(response.data.phone);
              this.secondFormGroup.controls['address2'].setValue(response.data.address);
            }
            else
              console.log('Customer not found!');
          }
        );
      }
    });

    this.fourthFormGroup.get('paymentPart')?.valueChanges.subscribe( x => {
      this.partCount = x;
      this.calculatePaymentPart();
    });

  }

}
