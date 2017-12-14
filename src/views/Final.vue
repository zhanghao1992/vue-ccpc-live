<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-button type="primary" style="margin-bottom: 20px;" @click="release">发布</el-button>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="ranking" label="排名"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="奖金（税前）" class="">
          <template slot-scope="scope">
            {{scope.row.reward}}元
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
  import MyHeader from '@/components/base/MyHeader/MyHeader'

  export default {
    data () {
      return {
        tableData: [],
        currentPage: 1,
        total: 0
      }
    },
    mounted () {
      this._getList(1, 10)
    },
    methods: {
      _getList (page, page_size, matchId) {
        this.$http.get('/node/player/getMatchPlayerRank', {
          params: {
            matchId: this.$route.params.matchId,
            page: page,
            page_size: page_size,
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
        this._getList(currentPage, 10)
      }
    },
    components: {
      MyHeader
    }
  }
</script>
