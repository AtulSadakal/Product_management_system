import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["brand-new", "second-hand", "refabrished"]
  productForm !: FormGroup;
  actionBtn: string = "save"

  constructor(private formBuilder: FormBuilder, private api: ApiService, private dialogref: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required]
    });
    //patch the data on form
    if (this.editData) {
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.actionBtn = "Update";
    }
  }




  addProduct() {
    if (!this.editData) {
      //console.log(this.productForm.value);
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Product Added Successfully!!',
                showConfirmButton: false,
                timer: 1500
              })
              this.productForm.reset();
              this.dialogref.close('save');
            },
            error: () => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error While Adding Product!',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
      }
    }else{
      this.updateProduct()
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Product Updated Successfully!!',
          showConfirmButton: false,
          timer: 1500
        })
        this.productForm.reset();
        this.dialogref.close('update')
      },
      error:()=>{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error While Updating!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
}
