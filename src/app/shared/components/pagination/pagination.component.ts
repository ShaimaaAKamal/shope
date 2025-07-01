import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '../../../Services/CommonService/common.service';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  pages:number[]=[];
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();

  totalPages = 1;
  constructor(private __CommonService:CommonService){}
  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }

  private calculatePagination() {
    this.totalPages = Math.max(Math.ceil(this.totalItems / this.pageSize), 1);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page:number){
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  onPrevClick(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  onNextClick(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  onPageClick(event: Event, page: number) {
    event.preventDefault();
    if (page !== this.currentPage) {
      this.__CommonService.saveToStorage('currentPage', page);
      this.changePage(page);
    }
  }
}
