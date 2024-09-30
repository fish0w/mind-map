<template>
  <div class="main-page">
    <!-- 左侧中部的重新打开标志 -->
    <div v-if="!drawer" class="drawer-opener" @click="drawer = true">
  <el-button type="primary" icon="el-icon-edit" circle></el-button>
    </div>

    <!-- 左侧弹出的Drawer，默认打开 -->
    <el-drawer
      title="MockMdGenerator"
      :visible.sync="drawer"
      direction="ltr"
      :before-close="handleClose"
      size="500px"
      :with-header="false"
    >
      <MockMdGenerator />
    </el-drawer>

    <!-- Index组件，位于页面的主要区域 -->
    <div class="index-container">
      <Index />
    </div>
  </div>
</template>

<script>
import Index from "@/pages/Edit/Index.vue";
import MockMdGenerator from "@/pages/Edit/components/MockMdGenerator.vue";

export default {
  components: {
    Index,
    MockMdGenerator,
  },
  data() {
    return {
      drawer: true, // 默认打开Drawer
    };
  },
  methods: {
    // 关闭Drawer时显示标志
    handleClose(done) {

          done()// 执行关闭


    },
  },
};
</script>

<style scoped lang="less">
.main-page {
  display: flex;
  min-height: 100vh; /* 确保页面至少占据整个视口的高度 */
  width: 100vw; /* 确保页面占满整个视口宽度 */
  position: relative;
}

.index-container {
  flex: 1; /* 让 Index 容器占据剩余空间 */
  max-width: 80%; /* 确保 Index 不会超出父容器的宽度 */
  position: relative; /* 确保它不会是绝对定位，避免覆盖 */
}

/* 左侧中部的重新打开标志 */
.drawer-opener {
  position: fixed;
  top: 50%; /* 使按钮在页面中部 */
  left: 0;
  transform: translateY(-50%);
  z-index: 1000;
}
</style>
