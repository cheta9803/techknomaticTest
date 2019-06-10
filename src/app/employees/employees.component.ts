import { Component, OnInit, ViewChild, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export interface PeriodicElement {
  employee_name: string;
  department: string;
  joining_date: string;
  age: number;
  location: string;
  gender: string;
  salary: number;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {


  employeesData: any;

  displayedColumns: string[] = ['employee_name', 'department', 'joining_date', 'age', 'location', 'gender', 'salary'];
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private chart: am4charts.XYChart;
  locationArr: any[];
  yearArr: any[];
  departmentArr: any[];
  filter: FormGroup;
  filterData: any;

  filterKey: any = {
    location: '',
    year: '',
    department: ''
  };
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private zone: NgZone
  ) { }

  location = new FormControl('');
  department = new FormControl('');
  year = new FormControl('');
  ngOnInit() {
    this.filter = this.fb.group({
      location: this.location,
      year: this.year,
      department: this.department
    })
    this.getService('', 'getAllRecords');
  }

  getService(params, url) {
    this.api.getServiceCall(params, url).subscribe(
      res => {
        this.employeesData = res.data;

        const locationMap = new Map();
        this.locationArr = [];

        const yearMap = new Map();
        this.yearArr = [];

        const departmentMap = new Map();
        this.departmentArr = [];

        for (const item of this.employeesData) {
          if (!locationMap.has(item.location.toLowerCase())) {
            locationMap.set(item.location.toLowerCase(), true);
            this.locationArr.push({
              id: item._id,
              location: item.location
            });
          }
          if (!departmentMap.has(item.department.toLowerCase())) {
            departmentMap.set(item.department.toLowerCase(), true);
            this.departmentArr.push({
              id: item._id,
              department: item.department
            });
          }
          if (!yearMap.has(item.age)) {
            yearMap.set(item.age, true);
            this.yearArr.push({
              id: item._id,
              age: item.age
            });
          }
        }
        this.yearArr.sort(function (a, b) {
          return a.age - b.age;
        });

        this.filterSubmit();

      },
      error => {
        console.log(error);
      }
    )
  }

  clearFilter() {
    this.filter.reset();
    this.filterSubmit();
  }

  filterSubmit() {
    this.filterKey = {
      location: this.filter.value.location,
      department: this.filter.value.department,
      age: this.filter.value.year
    }
    for (var key in this.filterKey) {
      if (!this.filterKey[key]) {
        delete this.filterKey[key];
      }
    }
    let that = this;
    this.filterData = this.employeesData.filter(function (item) {
      for (var key in that.filterKey) {
        if (item[key] === undefined || item[key] != that.filterKey[key])
          return false;
      }
      return true;
    });

    this.dataSource = new MatTableDataSource<PeriodicElement>(this.filterData);
    this.dataSource.paginator = this.paginator;
    this.createPieChart();
    this.createBarChart();
  }

  createPieChart() {
    let chart = am4core.create("pieChartdiv", am4charts.PieChart);
    chart.paddingLeft = 0;
    chart.marginLeft = 0;
    let maleCount = 0;
    let femaleCount = 0;
    for (const item of this.filterData) {
      if (item.gender.toLowerCase() == 'female') {
        femaleCount += 1;
      } else if (item.gender.toLowerCase() == 'male') {
        maleCount += 1;
      }
    }
    // Add data
    chart.data = [{
      "gender": "Male",
      "count": maleCount
    }, {
      "gender": "Female",
      "count": femaleCount
    }];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "gender";
    pieSeries.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    let rgm = new am4core.RadialGradientModifier();
    rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
    pieSeries.slices.template.fillModifier = rgm;
    pieSeries.slices.template.strokeModifier = rgm;
    pieSeries.slices.template.strokeOpacity = 0.4;
    pieSeries.slices.template.strokeWidth = 0;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
  }

  createBarChart() {
    let chart = am4core.create("barChartdiv", am4charts.XYChart);
    // Add data
    chart.data = this.filterData.sort(function (a, b) {
      return a.age - b.age
    });

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "age";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "salary";
    series.dataFields.categoryX = "age";
    series.name = "salary";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
    //   if (this.chart) {
    //     this.chart.dispose();
    //   }
    // });
  }

}
