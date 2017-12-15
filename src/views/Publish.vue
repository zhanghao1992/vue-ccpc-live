<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">轮次排名</el-menu-item>
        <el-menu-item index="2">单人成绩排名</el-menu-item>
        <el-menu-item index="3">最终排名</el-menu-item>
      </el-menu>
      <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="urlName" label="名称"></el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">{{formatUrl(scope.row.url)}}</template>
        </el-table-column>
        <el-table-column label="操作" class="">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="copy_btn"
              @click="doCopy(scope.row)">复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 16px;"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="1"
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
        activeIndex: this.$route.params.listType,
        tableData: [],
        currentPage: 1,
        total: 0,
        listType: this.$route.params.listType,
        message: '',
        host: null
      }
    },
    mounted () {
      this.host = window.location.host
      getLatestRound(this.$route.params.matchId).then((res) => {
        this.latestRound = res.data.response
        this._getList(this.currentPage, 10)
      })
    },
    methods: {
      _getList (page, page_size) {
        this.$http.get('/node/release/getReleaseList', {
          params: {
            matchId: this.$route.params.matchId,
            page: page,
            page_size: page_size,
            urlType: this.listType,
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
      handleCurrentChange (page) {
        this.currentPage = page
        this._getList(this.currentPage, 10)
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
      },
      doCopy (row) {
        this.message = `${this.host}/#${row.url}`
        var _this = this
        this.$copyText(this.message).then(() => {
          _this.$message({
            type: 'success',
            message: '复制成功！'
          })
        })
      },
      handleSelect (key) {
        this.listType = key
        let hash = window.location.hash
        const location = hash.lastIndexOf('/')
        window.location.hash = `${hash.substr(0, location)}/${key}`
        this.currentPage = 1
        this._getList(this.currentPage, 10)
      },
      formatUrl (url) {
        return `${this.host}/#${url}`
      }
    },
    components: {
      MyHeader
    }
  }
</script>
