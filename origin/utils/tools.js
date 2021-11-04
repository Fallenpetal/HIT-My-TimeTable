// 显示模态弹窗
function showModal (title,content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmColor: '#1F4BA5'
  })
}

module.exports = {
  showModal: showModal
}