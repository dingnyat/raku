import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BaseService} from "../../service/base.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  keyword: string;

  constructor(private route: ActivatedRoute, private baseService: BaseService) {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'];
      this.baseService.search({value: this.keyword, key: "track", start: 0, length: 6}).subscribe(resp => {
        console.log(resp);
      });
    });
  }

  ngOnInit(): void {
  }

}
