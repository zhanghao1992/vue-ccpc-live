<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-button type="primary" style="margin-bottom: 20px;" @click="release">发布</el-button>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="ranking" label="排名"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="score" label="总分"></el-table-column>
        <el-table-column prop="" label="修改">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="changeScore(scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
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
        tableData: [],
        currentPage: 1,
        total: 0,
        latestRound: null
      }
    },
    mounted () {
      getLatestRound(this.$route.params.matchId).then((res) => {
        this.latestRound = res.data.response
        this._getList(this.currentPage, 6, this.latestRound)
      })
    },
    methods: {
      _getList (page, page_size, round) {
        this.$http.get('/node/player/getMatchShiftRank', {
          params: {
            matchId: this.$route.params.matchId,
            page: page,
            page_size: page_size,
            round: round,
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
