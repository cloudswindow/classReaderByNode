(function () {

    Vue.component('key-value-element', {
        template: '#keyValueElement',
        props: ['item']
    })

    /**
     * class-element 组件
     */
    Vue.component('class-element', {
        template: '#classElement',
        props: ['classData']
    })

    /**
     * constant-pool-element 组件
     */
    Vue.component('constant-pool-element', {
        template: '#constantPoolElement',
        props: ['constantPoolData']
    })

    var app = new Vue({
        el: '#app',
        data: {
            classData: window.classData,
            constantPool: window.classData.constantPool
        }
    })


})()
