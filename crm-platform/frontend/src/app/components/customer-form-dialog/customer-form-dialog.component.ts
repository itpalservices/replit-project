import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { Customer } from "../../services/customer.service";

@Component({
  selector: "app-customer-form-dialog",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./customer-form-dialog.component.html",
  styleUrls: ["./customer-form-dialog.component.scss"],
})
export class CustomerFormDialogComponent implements OnInit {
  customerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CustomerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer | null,
  ) {
    this.customerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.pattern("^[0-9]")],
      company: [""],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.customerForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        company: this.data.company,
      });
    }
  }

  onSave() {
    if (this.customerForm.valid) {
      this.dialogRef.close(this.customerForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
