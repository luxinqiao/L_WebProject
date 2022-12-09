var RegUtils = {
    /**
        校验手机号
        @param {String}phone 手机号
        @return
    */
    validPhone: function(phone) {
        if (/^(1)[0-9]{10}$/.test(phone)) {
            return true
        }
        return false
    },
    phoneErr: '请填写正确的手机号'
};