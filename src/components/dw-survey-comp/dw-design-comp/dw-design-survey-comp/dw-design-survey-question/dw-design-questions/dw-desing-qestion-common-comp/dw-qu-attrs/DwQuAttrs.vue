<template>
  <!--  :value="survey.curEditObj[itemIndex].itemClick"-->
  <div>
    <div style="font-size: 14px;padding-bottom: 5px;">
      <div class="dw-qu-item">
        <div style="font-weight: bold;">{{ popoverTitle }}</div>
        <div class="dw-display-flex-right">
        </div>
      </div>
    </div>
    <div style="padding: 5px;">
      <div style="min-height: 50px;">
        <el-form ref="form" label-width="80px" size="mini" >
          <el-form-item label="是否必答">
            <el-radio-group v-model="survey.questions[index].quAttr.isRequired">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="副标题">
            <el-radio-group v-model="survey.questions[index].quAttr.showQuNote">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="survey.questions[index].quType === 'RADIO' || survey.questions[index].quType === 'CHECKBOX'">
            <el-form-item label="显示风格">
              <el-select v-model="survey.questions[index].hv" placeholder="请选择显示风格" style="margin-right: 10px;">
                <el-option :value="1" label="横向"></el-option>
                <el-option :value="2" label="竖向"></el-option>
                <el-option :value="4" label="下拉"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="survey.questions[index].hv === 1" label="每行显示">
              <span><el-input-number v-model="survey.questions[index].cellCount" style="margin-right: 10px;" ></el-input-number>列</span>
            </el-form-item>
            <template v-if="survey.questions[index].quType === 'RADIO'">
              <div style="border: 1px solid rgb(212 225 237);border-radius: 4px;padding: 5px;">
                <div style="padding: 10px;color: gray;">选择属性设置</div>
                <div style="padding: 8px 0;">
                  <el-form-item label="配置选项" style="margin-bottom: 0;">
                    <el-select v-model="tempForm.selectOptionIndex" placeholder="请选择选项">
                      <el-option v-for="(item, optionIndex) in survey.questions[index].quRadios" :key="`quCheckbox_${optionIndex}`" :label="item.optionTitleObj.dwText" :value="optionIndex"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="padding-top: 8px;padding-right: 8px;">
                  <el-form-item label="选项说明">
                    <el-radio-group v-model="survey.questions[index].quRadios[tempForm.selectOptionIndex].showOptionNote">
                      <el-radio :label="1">显示</el-radio>
                      <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="survey.questions[index].quRadios[tempForm.selectOptionIndex].showOptionNote===1">
                    <dw-input-props v-model="survey.questions[index].quRadios[tempForm.selectOptionIndex].inputAttr" :survey="survey" :index="index"></dw-input-props>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="survey.questions[index].quType === 'CHECKBOX'">
              <el-form-item label="选择个数">
                <div>最少 <el-input-number v-model="survey.questions[index].minLimit" style="margin-right: 10px;"></el-input-number></div>
                <div>最多 <el-input-number v-model="survey.questions[index].maxLimit"></el-input-number></div>
              </el-form-item>
              <div style="border: 1px solid rgb(212 225 237);border-radius: 4px;padding: 5px;">
                <div style="padding: 10px;color: gray;">选择属性设置</div>
                <div style="padding: 8px 0;">
                  <el-form-item label="配置选项" style="margin-bottom: 0;">
                    <el-select v-model="tempForm.selectOptionIndex" placeholder="请选择选项">
                      <el-option v-for="(item, optionIndex) in survey.questions[index].quCheckboxs" :key="`quCheckbox_${optionIndex}`" :label="item.optionTitleObj.dwText" :value="optionIndex"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="padding-top: 8px;padding-right: 8px;">
                  <el-form-item label="选项说明">
                    <el-radio-group v-model="survey.questions[index].quCheckboxs[tempForm.selectOptionIndex].showOptionNote">
                      <el-radio :label="1">显示</el-radio>
                      <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="survey.questions[index].quCheckboxs[tempForm.selectOptionIndex].showOptionNote===1">
                    <dw-input-props v-model="survey.questions[index].quCheckboxs[tempForm.selectOptionIndex].inputAttr" :survey="survey" :index="index"></dw-input-props>
                  </template>
                </div>
              </div>
            </template>
          </template>
          <template v-else-if="survey.questions[index].quType === 'FILLBLANK'">
            <dw-input-props v-model="survey.questions[index].quAttr.inputAttr" :survey="survey" :index="index"></dw-input-props>
          </template>
          <template v-else-if="survey.questions[index].quType === 'SCORE'">
            <el-form-item label="分值区间">
              从 <el-input-number v-model="survey.questions[index].paramInt01" style="margin-right: 10px;"></el-input-number>
              到 <el-input-number v-model="survey.questions[index].paramInt02" ></el-input-number>
            </el-form-item>
          </template>
          <template v-else-if="survey.questions[index].quType === 'MULTIFILLBLANK'">
            <el-form-item label="最少回答">
              <el-input-number v-model="survey.questions[index].paramInt01" style="margin-right: 10px;" ></el-input-number> 项
            </el-form-item>
            <div style="border: 2px solid rgb(212 225 237);border-radius: 4px;">
              <div style="background: rgb(212 225 237);padding: 8px 0;">
                <el-form-item label="选项属性" style="margin-bottom: 0;">
                  配置选项 <el-select v-model="tempForm.selectOptionIndex" placeholder="请选择选项">
                  <el-option
                    v-for="(item, optionIndex) in survey.questions[index].quMultiFillblanks"
                    :key="`quMFbk${optionIndex}`"
                    :label="item.optionTitleObj.dwText"
                    :value="optionIndex">
                  </el-option>
                </el-select> 的属性规则如下
                </el-form-item>
              </div>
              <div style="padding-top: 8px;padding-right: 8px;">
                <dw-input-props v-model="survey.questions[index].quMultiFillblanks[tempForm.selectOptionIndex].inputAttr" :survey="survey" :index="index"></dw-input-props>
              </div>
            </div>
          </template>
          <template v-else-if="survey.questions[index].quType === 'UPLOADFILE'">
            <el-form-item label="文件类型">
              <el-select v-model="survey.questions[index].fileAccept" placeholder="请选择文件类型" style="width: 290px;" >
                <el-option :value="0" label="不限"></el-option>
                <el-option :value="1" label="图片(.jpg,.jpeg,.png,.gif,.bmp)"></el-option>
                <el-option :value="2" label="文档(.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx)"></el-option>
                <el-option :value="100" label="自定义" ></el-option>
              </el-select>
              <el-input v-show="survey.questions[index].fileAccept === 100" v-model="survey.questions[index].customFileAccept" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="文件参数">
              上传附件数 <el-input-number v-model="survey.questions[index].fileLimit" style="margin-right: 15px;"></el-input-number>
              单个文件最大支持 <el-input-number v-model="survey.questions[index].fileSize"></el-input-number> M
              <div style="color: #c0c4cc;font-size: 12px;"> (空或0表示限制)</div>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import DwInputProps from '../DwInputProps.vue'

export default {
  name: 'DwQuAttrs',
  components: {DwInputProps},
  model: {
    prop: 'survey',
    event: 'update-survey'
  },
  props: {
    index: {type: Number, default: 0},
    survey: {type: Object, default: () => {}},
    popoverTitle: {type: String, default: '题目属性'}
  },
  data () {
    return {
      itemIndex: 0,
      checked: true,
      tempForm: {
        selectOptionIndex: 0
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.dw-qu-item{
  display: grid;
  grid-template-columns: auto 90px;
}
/deep/ .el-form-item__label{
  color: #333;
}
</style>
