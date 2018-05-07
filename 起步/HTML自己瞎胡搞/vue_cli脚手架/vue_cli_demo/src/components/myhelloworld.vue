<template>
  <input v-model="name" placeholder="请在此重新设置您要想打招呼的人">
  <button @click="myalert"></button>
</template>


<script>
  /*
      在.vue文件中，export default 后面的对象 就相当于 new Vue() 构造函数中的接受的对象，它们都是定义组件所需要的数据（data）, 以及操作数据的方法等，更为全面的一个 export default 对象
  */
  export default{
    name:"myhelloworld",
    props:['greeting'],
    //在组件内部的data属性只能通过函数的方式定义 不能直接像在vue实例中那样进行定义
    data(){
      return {
        name:this.greeting,
      }
    },
    methods:{
      myalert:function () {

        //子组件发射自定义事件 携带要传递的数据
        this.$emit('valueup',this.name)

        alert(this.name + 'World !')
      },
    }

  }



</script>


<!--scoped 表明这里写的css 样式只适用于该组件，可以限定样式的作用域-->
<style scoped>

  p{
    font-size: 2rem;
    text-align: center;
  }

</style>
