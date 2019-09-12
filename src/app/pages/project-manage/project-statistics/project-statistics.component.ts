import { Component, OnInit } from '@angular/core';
import { ProjectStatisticsService } from 'src/app/services/project-manage/project-statistics.service';
// declare const echarts: any
@Component({
  selector: 'app-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss']
})
export class ProjectStatisticsComponent implements OnInit {
  public stageOption: any;
  public typeOption: any;
  public statisticsOption: any;
  public reportOption: any;
  public stageLoading = true;
  public typeLoading = true;
  public statisticsLoading = true;
  public reportLoading = true;

  constructor(
    private projectStatisticsService: ProjectStatisticsService
  ) {
  }

  ngOnInit() {
    this.QueryProjectsMonthReport()
  }

  async QueryProjectsMonthReport() {
    const res = await this.projectStatisticsService.QueryProjectsMonthReport({})
    if (res.success) {
      let stageList = res.result[0]
      let typeList = res.result[1]
      let statisticsList = res.result[2]
      let reportList = res.result[3]
      this.setStageCount()
      this.stageOption.xAxis[0].data = stageList.map((element) => element.name)
      this.stageOption.series[0].data = stageList.map((element) => element.value)
      this.setTypePercentage()
      this.typeOption.series[0].data = typeList
      this.setStatistics()
      this.statisticsOption.xAxis[0].data = statisticsList.map((element) => element.name)
      this.statisticsOption.series[0].data = statisticsList.map((element) => element.value)
      this.setReportInfo()
      this.reportOption.xAxis[0].data = reportList.map((element) => element.name)
      this.reportOption.series[0].data = reportList.map((element) => element.value)
      // console.log(this.reportOption)
    }
    // console.log(this.stageOption)
  }

  // BIM项目各阶段数量
  setStageCount() {
    this.stageOption = {
      color: ['#23c6c8'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '各阶段数量',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    }
    this.stageLoading = false;
  }

  // BIM项目类型百分比
  setTypePercentage() {
    this.typeOption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
      series: [
        {
          name: '类型百分比',
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.typeLoading = false
  }

  // BIM项目近12个月统计情况
  setStatistics() {
    this.statisticsOption = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '统计情况',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    }
    this.statisticsLoading = false
  }

  // 各区县项目应用报建情况
  setReportInfo() {
    this.reportOption = {
      color: ['#f8ac59'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      dataZoom: [
        {
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 0,
          start: 0,
          end: 80
        },
        {
          type: "inside",
          show: true,
          height: 15,
          xAxisIndex: [
            0
          ],
          start: 1,
          end: 35
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '报建情况',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    }
    this.reportLoading = false
  }
}
