  const user={
    state:{
      userName:'',
      userId:'',
      cartCount:0,
    },

    mutations:{
      SET_USERID:(state, id)=>{
        state.userId=id
      },
      SET_NAME: (state, name) => {
        state.userName = name
      },
      SET_COUNT:(state, cartCount)=>{
        state.cartCount = cartCount
      },
      SET_UPDATECOUNT:(state, cartCount)=>{
        state.cartCount =parseInt(state.cartCount)+parseInt(cartCount)
      }
    },

    actions:{
      // //登录
      // Login({commit},userInfo){
      //   const userName=userInfo.userName.trim();
      //   return new Promise((resolve,reject)=>{
      //     axios.post('/api-dev/users/login',{
      //       userName:userName,
      //       userPwd:userInfo.userPwd
      //     }).then((res)=>{
      //       if(res.data.status=='1'){
      //         commit('SET_USERID', res.data.result.userId);
      //         commit('SET_NAME', res.data.result.userName);
      //         resolve()
      //       }
      //       if(res.data.status=='0') {
      //         reject(res.data.msg)
      //       }
      //     }).catch((err)=>{
      //       reject()
      //     });
      //   })
      // }
    }
  }
export default user
