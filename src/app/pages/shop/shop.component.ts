import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shop-params';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
import { DataImportService } from '../../core/services/import.service';
import data from '../../../../../../Users/Kevin/Downloads/CourseAssets/CourseAssets/seed data/delivery.json';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    EmptyStateComponent
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  private a = inject(DataImportService);
  products?: Pagination<Product>;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'},
  ]
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20]

  ngOnInit() {
    this.initialiseShop();
    // this.a.importData(data, 'delivery')
    //  this.a.importDataType(data, 'brand')
  }
  
  initialiseShop() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.getProducts();
  }

  resetFilters() {
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  async getProducts() {
    this.products = await this.shopService.getProductsWithPagination(this.shopParams);
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.shopParams.direction = undefined;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.direction = 
      event.pageIndex > event.previousPageIndex! ? 'forward' : 
      event.pageIndex == event.previousPageIndex ? undefined : 'backward' 
    
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      switch(selectedOption.value){
        case('name'):
        this.shopParams.sort = 'name';
        this.shopParams.sortOrder = 'desc';
          break;
        case('priceAsc'):
        this.shopParams.sort = 'price';
        this.shopParams.sortOrder = 'asc';
          break;
        case('priceDesc'):
        this.shopParams.sort = 'price';
        this.shopParams.sortOrder = 'desc';
          break;
      };
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.shopParams.direction = undefined;
          this.getProducts();
        }
      }
    })
  }
}