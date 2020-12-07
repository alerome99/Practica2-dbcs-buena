import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';


/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-add-nueva',
  templateUrl: './add-nueva.component.html',
  styleUrls: ['./add-nueva.component.css']
})
export class AddNuevaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns = ['select', 'tipo', 'marca', 'modelo'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}

export interface Element {
  tipo: number;
  marca: string;
  modelo: string;
}

const ELEMENT_DATA: Element[] = [
  {tipo: 1, marca: 'marca 1', modelo: 'modelo 1'},
  {tipo: 2, marca: 'marca 1', modelo: 'modelo 2'},
  {tipo: 3, marca: 'marca 2', modelo: 'modelo 3'},
  {tipo: 4, marca: 'marca 5', modelo: 'modelo 4'},
  {tipo: 5, marca: 'marca 5', modelo: 'modelo 5'},
  {tipo: 6, marca: 'marca 6', modelo: 'modelo 6'},
  {tipo: 1, marca: 'marca 7', modelo: 'modelo 7'},
  {tipo: 2, marca: 'marca 5', modelo: 'modelo 8'},
  {tipo: 3, marca: 'marca 8', modelo: 'modelo 8'},
];

