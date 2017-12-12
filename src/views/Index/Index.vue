<template>
  <section class="el-container is-vertical">
    <my-header></my-header>
    <main class="el-main">
      <el-button type="primary" style="margin-bottom: 20px;" @click="addMatchID">添加赛事ID</el-button>
      <el-table
        :data="tableData"
        style="width: 100%;">
        <el-table-column
          prop="matchId"
          label="赛事ID">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间">
        </el-table-column>
        <el-table-column label="操作" class="">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="deleteMatchId(scope.row)">删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goPublish(scope.row)">轮次排名
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goPublish(scope.row)">个人排名
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goPublish(scope.row)">总排名
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goPublish(scope.row)">发布地址
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </section>
</template>

<script>
  import MyHeader from '@/components/base/MyHeader/MyHeader'

  export default {
    data () {
      return {
        tableData: []
      }
    },
    mounted () {
      this._getList()
    },
    methods: {
      _getList () {
        this.$http.get('/node/match/getMatchList').then(json => {
          const res = json.data
          if (res.code === 0) {
            this.tableData = res.response
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      },
      addMatchID () {
        this.$prompt('请输入赛事ID', '添加赛事', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          this.$http.post('/node/match/addMatch', {
            matchId: value
          }).then(json => {
            const res = json.data
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加赛事成功！',
                onClose: () => {
                  this._getList()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
      },
      deleteMatchId (row) {
        this.$http.post('/node/match/deleteMatch', {
          matchId: row.matchId
        }).then(json => {
          const res = json.data
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除赛事ID成功！',
              onClose: () => {
                this._getList()
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      },
      goPublish (row) {
        this.$router.push({path: `/final/:${row.matchId}`})
      }
    },
    components: {
      MyHeader
    }
  }
</script>
