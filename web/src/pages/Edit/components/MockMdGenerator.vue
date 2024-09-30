<template>
  <div>
    <div class="left-title">AI对话区</div>
    <el-card>
      <el-form class="el-form">
        <el-form-item>
          <el-input
            type="textarea"
            v-model="userMessage"
            placeholder="输入主题或者粘贴内容"
            :rows="4"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="bt" type="primary" @click="sendMessage" :loading="isLoading" size="small">
            发送
          </el-button>
        </el-form-item>

        <el-form-item v-if="aiReply">
          <el-input
            type="textarea"
            v-model="aiReply"
            :rows="15"
            readonly
          />
        </el-form-item>
        <el-form-item v-if="aiReply">
          <!-- 保存按钮 -->
          <el-button class="bt" type="success" @click="saveToLocalStorage" :disabled="!aiReply">
            生成导图
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      userMessage: '',
      aiReply: '',
      isLoading: false,
      conversationHistory: [],
      prompt: "用户将给你一个主题或者一些文本材料，如果是一个主题，请根据你的知识给出详细的介绍该主题文本材料；将文本材料（你根据主题生成的或者是用户输入的）进行归纳总结，其形成一份markdown层级大纲文本，逻辑清楚，层级关系明确，层级用#号的数量来表示。\n" +
        "如果用户输入已经是一个markdown文本，请在其基础上继续补充完善内容。答案中不要包含任何其他的内容！！！\n" +
        "答案只有Markdown层级文本！！！只有一个根层级（即一个#号的层级）。以下是用户输入："
    };
  },
  computed: {
    ...mapState({
      apiUrl: 'https://api.openai-hub.com/v1/chat/completions',
      accessToken: 'sk-D92gxqb2colg98D2921b44Ff5e434e928d82543535302f5f',
      model: 'gpt-4o-mini',
    }),
  },
  methods: {
    async sendMessage() {
      if (!this.userMessage) {
        return;
      }

      this.isLoading = true;
      this.aiReply = '';
      this.conversationHistory.push({ role: 'user', content: this.prompt + this.userMessage });

      try {
        const response = await fetch("https://api.openai-hub.com/v1/chat/completions", {
          method: 'POST',
          headers: {
            Authorization: `Bearer sk-D92gxqb2colg98D2921b44Ff5e434e928d82543535302f5f`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            stream: true,
            messages: this.conversationHistory,
          }),
        });

        const reader = response.body?.getReader();
        let aiReply = '';

        while (true) {
          const { done, value } = await reader?.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          const lines = text.trim().split('\n');

          for (let line of lines) {
            if (line.startsWith('data: ')) {
              const jsonData = line.substring(6);

              // 跳过 [DONE] 标识符
              if (jsonData === '[DONE]') {
                continue;
              }

              try {
                const jsonData = JSON.parse(line.substring(6));
                const content = jsonData.choices[0].delta?.content;

                if (content) {
                  aiReply += content;
                  this.aiReply += content;
                  this.scrollToBottom();
                }
              } catch (error) {
                console.error('解析消息时出错:', error);
              }
            }
          }
        }

        this.conversationHistory.push({ role: 'assistant', content: aiReply });
        this.scrollToBottom();
      } catch (error) {
        console.error('发送消息时出错:', error);
      } finally {
        this.isLoading = false;
      }
    },
    // 保存AI生成内容到localStorage
    saveToLocalStorage() {
      if (this.aiReply) {
        localStorage.setItem('mockMdFile', this.aiReply);
        this.$bus.$emit('saveMdFileToAnotherComponent', this.mdContent);
      } else {
        alert('AI回复内容为空');
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea[readonly]');
        if (textarea) {
          textarea.scrollTop = textarea.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.left-title {
  margin-top: 8px;
  text-align: center;  /* 居中 */
  font-size: 24px;     /* 较大的字体 */
  font-weight: bold;   /* 加粗 */
  margin-bottom: 8px; /* 添加下方外边距 */
  color: #5a9cf8;
}

.el-card {
  width: 100%;
  max-width: 800px; /* 调整对话框的最大宽度 */
  margin: 0 auto;   /* 使其居中 */
}
.el-form{
  display: flex;
  flex-direction: column;
}
.bt{
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
.el-input {
  width: 100%;
height: 500px

}
</style>
