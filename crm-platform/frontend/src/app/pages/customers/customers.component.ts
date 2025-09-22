import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService, Customer } from '../../services/customer.service';
import { CustomerFormDialogComponent } from '../../components/customer-form-dialog/customer-form-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  animations: [],
  template: `
    <div class="customers-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Customer Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Custom Tab Buttons -->
          <div class="tab-buttons">
            <button 
              mat-raised-button 
              [color]="currentView === 'active' ? 'primary' : ''" 
              (click)="switchView('active')"
              class="tab-button">
              <mat-icon>people</mat-icon>
              Active Customers
            </button>
            <button 
              mat-raised-button 
              [color]="currentView === 'deleted' ? 'primary' : ''" 
              (click)="switchView('deleted')"
              class="tab-button">
              <mat-icon>delete</mat-icon>
              Deleted Customers
            </button>
          </div>

          <!-- Active Customers View -->
          <div 
            [class.active]="currentView === 'active'"
            [class.hidden]="currentView !== 'active'"
            class="tab-content view-active">
            <div class="table-header">
              <mat-form-field appearance="outline">
                <mat-label>Search customers</mat-label>
                <input matInput (keyup)="applyFilter($event, 'active')" placeholder="Search...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="openCustomerDialog()">
                <mat-icon>add</mat-icon>
                Add Customer
              </button>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="activeDataSource" matSort #activeSort="matSort">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                  <td mat-cell *matCellDef="let customer">{{customer.name}}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                  <td mat-cell *matCellDef="let customer">{{customer.email}}</td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
                  <td mat-cell *matCellDef="let customer">{{customer.phone}}</td>
                </ng-container>

                <ng-container matColumnDef="company">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Company</th>
                  <td mat-cell *matCellDef="let customer">{{customer.company}}</td>
                </ng-container>

                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                  <td mat-cell *matCellDef="let customer">{{customer.createdAt | date:'short'}}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let customer">
                    <button mat-icon-button [matMenuTriggerFor]="activeActionsMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #activeActionsMenu="matMenu">
                      <button mat-menu-item (click)="editCustomer(customer)">
                        <mat-icon>edit</mat-icon>
                        <span>Edit Customer</span>
                      </button>
                      <button mat-menu-item (click)="deleteCustomer(customer.id)">
                        <mat-icon>delete</mat-icon>
                        <span>Delete Customer</span>
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <mat-paginator #activePaginator [pageSizeOptions]="[5, 10, 20]"
                            showFirstLastButtons
                            aria-label="Select page of customers">
              </mat-paginator>
            </div>
          </div>

          <!-- Deleted Customers View -->
          <div 
            [class.active]="currentView === 'deleted'"
            [class.hidden]="currentView !== 'deleted'"
            class="tab-content view-deleted">
            <div class="table-header">
              <mat-form-field appearance="outline">
                <mat-label>Search deleted customers</mat-label>
                <input matInput (keyup)="applyFilter($event, 'deleted')" placeholder="Search...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="deletedDataSource" matSort #deletedSort="matSort">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                  <td mat-cell *matCellDef="let customer">{{customer.name}}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                  <td mat-cell *matCellDef="let customer">{{customer.email}}</td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
                  <td mat-cell *matCellDef="let customer">{{customer.phone}}</td>
                </ng-container>

                <ng-container matColumnDef="company">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Company</th>
                  <td mat-cell *matCellDef="let customer">{{customer.company}}</td>
                </ng-container>

                <ng-container matColumnDef="deletedAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Deleted</th>
                  <td mat-cell *matCellDef="let customer">{{customer.deletedAt | date:'short'}}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let customer">
                    <button mat-icon-button [matMenuTriggerFor]="deletedActionsMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #deletedActionsMenu="matMenu">
                      <button mat-menu-item (click)="restoreCustomer(customer.id)">
                        <mat-icon>restore</mat-icon>
                        <span>Restore Customer</span>
                      </button>
                      <button mat-menu-item (click)="permanentlyDeleteCustomer(customer.id)">
                        <mat-icon>delete_forever</mat-icon>
                        <span>Delete Permanently</span>
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="deletedDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: deletedDisplayedColumns;"></tr>
              </table>

              <mat-paginator #deletedPaginator [pageSizeOptions]="[5, 10, 20]"
                            showFirstLastButtons
                            aria-label="Select page of deleted customers">
              </mat-paginator>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .customers-container {
      padding: 0;
    }

    .tab-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .tab-button {
      min-width: 160px;
      height: 48px;
    }

    .tab-content {
      padding: 16px 0;
      transition: opacity 0.3s ease-in-out;
    }

    .tab-content.hidden {
      opacity: 0;
      position: absolute;
      pointer-events: none;
      visibility: hidden;
    }

    .tab-content.active {
      opacity: 1;
      position: relative;
      pointer-events: auto;
      visibility: visible;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .mat-mdc-table {
      width: 100%;
      min-width: 600px;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .tab-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .tab-button {
        min-width: unset;
        width: 100%;
      }

      .table-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .mat-mdc-form-field {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .tab-buttons {
        gap: 12px;
      }
    }
  `]
})
export class CustomersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'company', 'createdAt', 'actions'];
  deletedDisplayedColumns: string[] = ['name', 'email', 'phone', 'company', 'deletedAt', 'actions'];

  activeDataSource = new MatTableDataSource<Customer>();
  deletedDataSource = new MatTableDataSource<Customer>();
  
  currentView: 'active' | 'deleted' = 'active';

  @ViewChild('activePaginator') activePaginator!: MatPaginator;
  @ViewChild('deletedPaginator') deletedPaginator!: MatPaginator;
  @ViewChild('activeSort') activeSort!: MatSort;
  @ViewChild('deletedSort') deletedSort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadActiveCustomers();
    this.loadDeletedCustomers();
  }

  ngAfterViewInit() {
    this.activeDataSource.paginator = this.activePaginator;
    this.deletedDataSource.paginator = this.deletedPaginator;
    this.activeDataSource.sort = this.activeSort;
    this.deletedDataSource.sort = this.deletedSort;
  }

  loadActiveCustomers() {
    this.customerService.getActiveCustomers().subscribe({
      next: (customers) => {
        this.activeDataSource.data = customers;
      },
      error: (error) => {
        this.snackBar.open('Error loading customers', 'Close', { duration: 3000 });
        console.error('Error loading customers:', error);
      }
    });
  }

  loadDeletedCustomers() {
    this.customerService.getDeletedCustomers().subscribe({
      next: (customers) => {
        this.deletedDataSource.data = customers;
      },
      error: (error) => {
        this.snackBar.open('Error loading deleted customers', 'Close', { duration: 3000 });
        console.error('Error loading deleted customers:', error);
      }
    });
  }

  applyFilter(event: Event, type: 'active' | 'deleted') {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type === 'active') {
      this.activeDataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.deletedDataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  switchView(view: 'active' | 'deleted') {
    this.currentView = view;
  }

  openCustomerDialog(customer?: Customer) {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '400px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (customer) {
          this.updateCustomer(customer.id, result);
        } else {
          this.createCustomer(result);
        }
      }
    });
  }

  editCustomer(customer: Customer) {
    this.openCustomerDialog(customer);
  }

  createCustomer(customerData: any) {
    this.customerService.createCustomer(customerData).subscribe({
      next: () => {
        this.snackBar.open('Customer created successfully', 'Close', { duration: 3000 });
        this.loadActiveCustomers();
      },
      error: (error) => {
        this.snackBar.open('Error creating customer', 'Close', { duration: 3000 });
        console.error('Error creating customer:', error);
      }
    });
  }

  updateCustomer(id: string, customerData: any) {
    this.customerService.updateCustomer(id, customerData).subscribe({
      next: () => {
        this.snackBar.open('Customer updated successfully', 'Close', { duration: 3000 });
        this.loadActiveCustomers();
      },
      error: (error) => {
        this.snackBar.open('Error updating customer', 'Close', { duration: 3000 });
        console.error('Error updating customer:', error);
      }
    });
  }

  deleteCustomer(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Customer',
        message: 'Are you sure you want to delete this customer? They will be moved to the deleted customers list.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
            this.loadActiveCustomers();
            this.loadDeletedCustomers();
          },
          error: (error) => {
            this.snackBar.open('Error deleting customer', 'Close', { duration: 3000 });
            console.error('Error deleting customer:', error);
          }
        });
      }
    });
  }

  restoreCustomer(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Restore Customer',
        message: 'Are you sure you want to restore this customer?',
        confirmText: 'Restore',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.restoreCustomer(id).subscribe({
          next: () => {
            this.snackBar.open('Customer restored successfully', 'Close', { duration: 3000 });
            this.loadActiveCustomers();
            this.loadDeletedCustomers();
          },
          error: (error) => {
            this.snackBar.open('Error restoring customer', 'Close', { duration: 3000 });
            console.error('Error restoring customer:', error);
          }
        });
      }
    });
  }

  permanentlyDeleteCustomer(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Permanently Delete Customer',
        message: 'Are you sure you want to permanently delete this customer? This action cannot be undone.',
        confirmText: 'Delete Forever',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.permanentlyDeleteCustomer(id).subscribe({
          next: () => {
            this.snackBar.open('Customer permanently deleted', 'Close', { duration: 3000 });
            this.loadDeletedCustomers();
          },
          error: (error) => {
            this.snackBar.open('Error permanently deleting customer', 'Close', { duration: 3000 });
            console.error('Error permanently deleting customer:', error);
          }
        });
      }
    });
  }
}