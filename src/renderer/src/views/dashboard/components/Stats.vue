<script setup lang="ts">
const userStore = useUserStore()
</script>

<template>
  <div>
    <el-descriptions :column="2" :border="true" direction="vertical" w-400px size="small">
      <el-descriptions-item label="武勋" label-width="200">
        <div>
          <div flex justify-between>
            <span>每日</span>
            <NumberLimitDisplay :value="userStore.userStatus.mbp?.daily" />
          </div>
          <div flex justify-between>
            <span>每周</span>
            <NumberLimitDisplay :value="userStore.userStatus.mbp?.weekly" />
          </div>
          <div flex justify-between gap-2>
            <div flex flex-1 justify-between>
              <span>R奖励</span>
              <NumberLimitDisplay :value="userStore.userStatus.mbp?.bonus.r" />
            </div>
            <div flex flex-1 justify-between>
              <span>SR奖励</span>
              <NumberLimitDisplay :value="userStore.userStatus.mbp?.bonus.sr" />
            </div>
          </div>
          <div flex justify-between>
            <span>总计</span>
            <NumberLimitDisplay :value="userStore.userStatus.mbp?.total" />
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="转世" label-width="200">
        <div>
          <div flex justify-between>
            <span>门票</span>
            <NumberLimitDisplay :value="userStore.userStatus.arcarum?.passport" />
          </div>
          <div flex justify-between>
            <span>每周</span>
            <NumberLimitDisplay :value="userStore.userStatus.arcarum?.point.weekly" />
          </div>
          <div flex justify-between>
            <span>总计</span>
            <NumberLimitDisplay :value="userStore.userStatus.arcarum?.point.total" />
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="荣誉">
        <div>
          <div flex justify-between>
            <span>每周</span>
            <NumberLimitDisplay :value="userStore.userStatus.hmbp?.weekly" />
          </div>
          <div flex justify-between gap-2>
            <div flex flex-1 justify-between>
              <span>骑空团奖励</span>
              <NumberLimitDisplay :value="userStore.userStatus.hmbp?.bonus.crew" />
            </div>
          </div>
          <div flex justify-between>
            <span>总计</span>
            <NumberLimitDisplay :value="userStore.userStatus.hmbp?.total" />
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="FP">
        <div>
          <div flex justify-between>
            <span>每周</span>
            <NumberLimitDisplay :value="userStore.userStatus.followPoint?.weekly" />
          </div>
          <div flex justify-between>
            <span>总计</span>
            <NumberLimitDisplay :value="userStore.userStatus.followPoint?.total" />
          </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="神器">
        <div flex justify-between>
          <span>掉落UP</span>
          <NumberLimitDisplay :value="userStore.userStatus.artifact" />
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
