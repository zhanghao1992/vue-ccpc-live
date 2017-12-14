<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <el-button type="primary" style="margin-bottom: 20px;" @click="release">发布</el-button>
        </el-col>
        <el-col :span="8">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
              <el-input v-model="formInline.remark" placeholder="请输入搜索信息" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table
        :data="tableData" style="width: 100%;">=
        <el-table-column prop="round" label="轮次" class=""></el-table-column>
        <el-table-column prop="ranking" label="排名"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="score" label="总分"></el-table-column>
        <el-table-column label="名次变动" class="">
          <template slot-scope="scope">
            <p v-if="scope.row.rankingChange>0" style="color: green;">
              <i class="el-icon-arrow-up"></i>
              <span>{{scope.row.rankingChange}}</span>
            </p>
            <p v-if="scope.row.rankingChange==0" style="color: blue;">
              <i class="el-icon-minus"></i>
              <span>{{scope.row.rankingChange}}</span>
            </p>
            <p v-if="scope.row.rankingChange<0" style="color: red;">
              <i class="el-icon-arrow-down"></i>
              <span>{{-scope.row.rankingChange}}</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total"
        style="margin-top: 16px;"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </main>
  </section>
</template>

<script>
  import { getLatestRound } from '@/assets/js/fn'
  import MyHeader from '@/components/base/MyHeader/MyHeader'

  export default {
    data () {
      return {
        formInline: {
          remark: ''
        },
        tableData: [],
        currentPage: 1,
        total: 0,
        latestRound: null
      }
    },
    mounted () {
      getLatestRound(this.$route.params.matchId).then((res) => {
        this.latestRound = res.data.response
      })
    },
    methods: {
      onSubmit () {
        this._getList(this.currentPage, 6, this.latestRound)
      },
      _getList (page, page_size, round) {
        this.$http.get('/node/player/getMatchSingleRoundRank', {
          params: {
            matchId: this.$route.params.matchId,
            page: page,
            page_size: page_size,
            round: round,
            remark: this.formInline.remark,
            _: new Date().getTime()
          }
        }).then(json => {
          const res = json.data
          if (res.code === 0) {
            this.tableData = res.response.list
            this.total = res.response.total
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      },
      release () {},
      handleCurrentChange (currentPage) {
        this.currentPage = currentPage
        this._getList(this.currentPage, 6, this.latestRound)
      },
      changeScore (row) {
        this.$prompt('请输入分数', '修改赛事总分', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          this.$http.post('/node/player/updatePlayerScore', {
            matchId: value
          }).then(json => {
            const res = json.data
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改赛事分数成功！',
                onClose: () => {
                  this._getList(this.currentPage, 6, this.latestRound)
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }).catch(() => {})
      }
    },
    components: {
      MyHeader
    }
  }
</script>
