$(function () {
    if (localStorage.getItem('goods')) {
        // 获取购物车数据
        var goodsArr = JSON.parse(localStorage.getItem('goods'))
        if (goodsArr.length <= 0) {
            localStorage.removeItem('goods')
            var newLi = '<li>购物车暂无数据！</li>'
            $('.list').html(newLi)
        }
        // 获取所有数据
        $.ajax({
            url: './data/goods.json',
            type: 'get',
            dataType: 'json',
            success: function (json) {
                var domStr = ''
                $.each(json, function (index, item) {
                    $.each(goodsArr, function (i, obj) {
                        if (item.id === obj.id) {
                            domStr += `
                              <li>
                                <input type="checkbox" checked=${ $('all').prop('checked') }>
                                <img src="${item.imgurl}" alt="">
                                <h3>${item.title}</h3>
                                <p>${item.price}</p>
                                <button class="btn_add" newId="${item.id}">+</button>
                                <span>${obj.num}</span>
                                <button class="btn_reduce" newId2="${item.id}">-</button>
                                <em data-id="${item.id}">删除</em>
                              </li>
                              `

                        }
                    })
                })
                $('.list').html(domStr)
            }
        })
        // 删除商品
        $('.list').on('click', 'li em', function () {
            // 当前点击的商品id
            var id = $(this).attr('data-id')
            $.each(goodsArr, function (index, item) {
                if (item.id === id) {
                    goodsArr.splice(index, 1)
                    return false
                }
            })
            // 删除dom结构
            $(this).parent().remove()
            // 更新本地存储的数据
            localStorage.setItem('goods', JSON.stringify(goodsArr))
            if (goodsArr.length <= 0) {
                localStorage.removeItem('goods')
                var newLi = '<li>购物车暂无数据！</li>'
                $('.list').html(newLi)
            }
        })
    } else {
        var newLi = '<li>购物车暂无数据！</li>'
        $('.list').html(newLi)
    }

    //增加删除数据
    ;(function () {
        var goodsArr = []
        if (localStorage.getItem('goods')) {
            goodsArr = JSON.parse(localStorage.getItem('goods'))
            //  商品增加功能
            $('.list').on('click', '.btn_add', function () {
                var id = $(this).attr('newId')//当前点击商品的id
                var _this = this
                $.each(goodsArr, function (index, item) {
                    if (item.id === id) {
                        item.num++
                        $(_this).siblings('span').html(item.num);
                    }
                })
                // 数据更新到本地存储
                localStorage.setItem('goods', JSON.stringify(goodsArr))
            });
            //  商品减少功能
            $('.list').on('click', '.btn_reduce', function () {
                var _this = this
                var id2 = $(this).attr('newId2')//当前点击商品的id
                $.each(goodsArr, function (index, item) {
                    if (item.id === id2) {
                        item.num--;
                        if (item.num <= 0) {
                            goodsArr.splice(index, 1)
                            $(_this).parent().remove()
                            return false
                        }
                    }
                    $(_this).siblings('span').html(item.num);
                })
                if (goodsArr.length <= 0) {
                    localStorage.removeItem('goods')
                    var newLi = '<li>购物车暂无数据！</li>'
                    $('.list').html(newLi)
                }
                // 数据更新到本地存储
                localStorage.setItem('goods', JSON.stringify(goodsArr));
            })
            // console.log(goodsArr);
        }
    })()
    //全选按钮
    var all = $('.all')
    if (goodsArr.length > 0) {
        all.prop('checked',true)
    }
    all.click(function () {
        if ($(this).prop('checked')) {
            $('.list li input').prop('checked', true)
        } else if (!$(this).prop('checked')) {
            $('.list li input').prop('checked', false);
        }
    });
    //单选按钮
    $('.list').on('click', 'li input', function () {
        $('.list li input').each(function (index, item) {
            if (!$(item).prop('checked')) {
                all.prop('checked', false);
                return false;
            } else {
                all.prop('checked', true);
            }
        })
    })
    // 结账功能
    var billPlease = $('.billPlease')
    billPlease.click(function () {
        var num = 0
        var flag = false
        $('.list li input').each(function (index, item) {
            if (item.checked) {
                num += parseFloat($(this).siblings('p').text()) * parseFloat($(this).siblings('span').text())
                flag = true
            }
        })
        if (!flag) {
            alert('没有选中商品')
            return false
        }
        alert('一共' + num + '元');
    })
})
