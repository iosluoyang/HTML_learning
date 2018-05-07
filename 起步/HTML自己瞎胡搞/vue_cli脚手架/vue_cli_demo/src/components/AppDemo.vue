<template>
    <h1>我是父组件</h1>

    <myhelloworld :greeting="hiname" @valueup="receivenewvalue"></myhelloworld>

</template>

<script>

    import myhelloworld from 'myhelloworld'

    export default {
        name: "app-demo",
        data(){
            return {
                hiname:"Phil Liu",
            }
        },
        methods:{
            receivenewvalue:function (newvalue) {

                this.hiname = newvalue

            }
        }
    }
</script>

<style scoped>

</style>
